export const useAIAgent = (supabase, setDrugs) => {
  const addDrugWithAI = async (userMessage) => {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system: `Extract drug info and return ONLY this JSON with no extra text:
{"name":"","category":"","unit":"tablets","quantity":0,"reorderLevel":50,"costPrice":0,"expiryDate":"YYYY-MM-DD","supplier":""}`,
        messages: [{ role: "user", content: userMessage }]
      })
    });
    const data = await res.json();
    const drug = JSON.parse(data.content[0].text.replace(/```json|```/g, "").trim());
    const { error } = await supabase.from("drugs").insert([{
      name: drug.name,
      category: drug.category,
      unit: drug.unit,
      quantity: drug.quantity,
      reorder_level: drug.reorderLevel,
      cost_price: drug.costPrice,
      expiry_date: drug.expiryDate,
      supplier: drug.supplier
    }]);
    if (error) throw new Error(error.message);
    const cached = JSON.parse(localStorage.getItem("pharmaops_drugs") || "[]");
    const updated = [{ ...drug, id: Date.now() }, ...cached];
    localStorage.setItem("pharmaops_drugs", JSON.stringify(updated));
    setDrugs(updated);
    return drug.name;
  };
  return { addDrugWithAI };
};
