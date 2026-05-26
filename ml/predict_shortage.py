import os
from dotenv import load_dotenv
from supabase import create_client
import pandas as pd
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta
import json

load_dotenv()

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def predict_stockout(drug_id: str):
    thirty_days_ago = (datetime.now() - timedelta(days=30)).date().isoformat()
    
    result = supabase.table("transactions")\
        .select("*")\
        .eq("drug_id", drug_id)\
        .gte("transaction_date", thirty_days_ago)\
        .execute()
    
    if not result.data or len(result.data) < 5:
        return None

    df = pd.DataFrame(result.data)
    df['transaction_date'] = pd.to_datetime(df['transaction_date'])
    df['day_number'] = (df['transaction_date'] - df['transaction_date'].min()).dt.days

    X = df[['day_number']]
    y = df['quantity_used']

    model = LinearRegression()
    model.fit(X, y)

    avg_daily_consumption = model.predict([[30]])[0]

    inventory = supabase.table("inventory")\
        .select("quantity")\
        .eq("drug_id", drug_id)\
        .execute()

    if not inventory.data:
        return None

    current_stock = inventory.data[0]['quantity']

    if avg_daily_consumption <= 0:
        return None

    days_until_stockout = current_stock / avg_daily_consumption

    return {
        "drug_id": drug_id,
        "current_stock": current_stock,
        "avg_daily_consumption": round(avg_daily_consumption, 2),
        "days_until_stockout": round(days_until_stockout, 1),
        "predicted_stockout_date": (
            datetime.now() + timedelta(days=days_until_stockout)
        ).date().isoformat()
    }

def run_predictions():
    drugs = supabase.table("drugs").select("id, name").execute()

    for drug in drugs.data:
        prediction = predict_stockout(drug['id'])

        if prediction and prediction['days_until_stockout'] < 14:
            supabase.table("alerts").insert({
                "drug_id": drug['id'],
                "alert_type": "stockout",
                "message": f"{drug['name']} will run out in {prediction['days_until_stockout']} days. Current stock: {prediction['current_stock']} units.",
                "is_resolved": False
            }).execute()
            print(f"Alert created for {drug['name']}")

        if prediction:
            print(json.dumps({**prediction, "drug_name": drug['name']}, indent=2))

if __name__ == "__main__":
    run_predictions()
