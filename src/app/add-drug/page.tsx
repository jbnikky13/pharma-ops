"use client";
// @ts-nocheck
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAIAgent } from "../../hooks/useAIAgent";

export default function AddDrug() {
  const [drugs, setDrugs] = useState([]);
  const { addDrugWithAI } = useAIAgent(supabase, setDrugs);
  const [form, setForm] = useState<Record<string, string>>({ name: "", category: "", unit: "tablets", quantity: "", reorder_level: "50", cost_price: "", expiry_date: "", supplier: "" });
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleManualAdd = async () => {
    if (!form.name || !form.quantity) { setMessage("❌ Drug name and quantity are required."); return; }
    const { error } = await supabase.from("drugs").insert([form]);
    if (error) { setMessage("❌ Error: " + error.message); return; }
    const cached = JSON.parse(localStorage.getItem("pharmaops_drugs") || "[]");
    localStorage.setItem("pharmaops_drugs", JSON.stringify([{ ...form, id: Date.now() }, ...cached]));
    setMessage("✅ Drug added successfully!");
    setForm({ name: "", category: "", unit: "tablets", quantity: "", reorder_level: "50", cost_price: "", expiry_date: "", supplier: "" });
  };

  const handleAIAdd = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    setMessage("");
    try {
      const name = await addDrugWithAI(aiInput);
      setMessage(`✅ ${name} added via AI!`);
      setAiInput("");
    } catch (err: unknown) {
      setMessage("❌ AI Error: " + (err instanceof Error ? err.message : String(err)));
    }
    setAiLoading(false);
  };

  const inputStyle = { width: "100%", background: "#141c28", border: "1px solid #1e2a3a", borderRadius: 10, padding: "10px 12px", color: "#e2e8f0", fontSize: 14, boxSizing: "border-box" as const };
  const labelStyle = { display: "block", fontSize: 12, color: "#94a3b8", marginBottom: 5, fontWeight: 600 };

  return (
    <div style={{ padding: 20, maxWidth: 500 }}>
      <h1 style={{ color: "#fff", marginBottom: 4 }}>Add Drug</h1>
      <p style={{ color: "#64748b", marginBottom: 20 }}>Add manually or use the AI Agent below</p>

      <div style={{ background: "#0d1117", border: "1px solid #1e2a3a", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        {[["Drug Name *", "name", "text", "e.g. Paracetamol"], ["Category", "category", "text", "e.g. Analgesic"], ["Quantity *", "quantity", "number", "e.g. 1000"], ["Reorder Level", "reorder_level", "number", "50"], ["Cost Price (₦)", "cost_price", "number", "e.g. 50"], ["Supplier", "supplier", "text", "e.g. Emzor Pharmaceuticals"]].map(([label, key, type, placeholder]) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <label style={labelStyle}>{label}</label>
            <input type={type} value={form[key]} onChange={e => setForm((prev: typeof form) => ({ ...prev, [key as keyof typeof form]: e.target.value }))} placeholder={placeholder} style={inputStyle} />
          </div>
        ))}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Unit</label>
          <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} style={inputStyle}>
            {["tablets","capsules","syrup","injection","cream","drops","sachets","other"].map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Expiry Date</label>
          <input type="date" value={form.expiry_date} onChange={e => setForm({ ...form, expiry_date: e.target.value })} style={inputStyle} />
        </div>
        {message && <p style={{ color: message.startsWith("✅") ? "#00c853" : "#ef4444", fontSize: 13 }}>{message}</p>}
        <button onClick={handleManualAdd} style={{ width: "100%", padding: 13, background: "#00c853", color: "#000", fontWeight: 800, fontSize: 15, border: "none", borderRadius: 12, cursor: "pointer" }}>Add Drug</button>
      </div>

      <div style={{ background: "#0d1117", border: "1px solid #00c85333", borderRadius: 16, padding: 20 }}>
        <p style={{ color: "#00c853", fontWeight: 700, marginBottom: 8, fontSize: 15 }}>🤖 AI Agent</p>
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 12 }}>Describe the drug in plain text and AI will fill and save it automatically.</p>
        <textarea
          value={aiInput}
          onChange={e => setAiInput(e.target.value)}
          placeholder='e.g. "Add 500 Proguanil tablets, anti-malarial, expiry May 2030, cost ₦50, supplier Emzor, reorder 100"'
          rows={4}
          style={{ ...inputStyle, resize: "vertical" as const }}
        />
        <button onClick={handleAIAdd} disabled={aiLoading} style={{ marginTop: 10, width: "100%", padding: 13, background: aiLoading ? "#1e2a3a" : "#00c853", color: aiLoading ? "#64748b" : "#000", fontWeight: 800, fontSize: 15, border: "none", borderRadius: 12, cursor: aiLoading ? "not-allowed" : "pointer" }}>
          {aiLoading ? "⏳ AI is processing..." : "✨ Add with AI"}
        </button>
      </div>
    </div>
  );
}