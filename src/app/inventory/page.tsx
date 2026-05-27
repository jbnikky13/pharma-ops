"use client";
// @ts-nocheck
import { useState } from "react";
import { useDrugs } from "../../hooks/useDrugs";
import { exportExcel, exportPDF, exportWord } from "../../utils/exportDrugs";
import { supabase } from "../../lib/supabase";

export default function Inventory() {
  const { drugs, loading } = useDrugs(supabase) as { drugs: any[], loading: boolean };

  if (loading) return <p style={{ color: "#fff", padding: 20 }}>Loading inventory...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ color: "#fff", marginBottom: 4 }}>Inventory</h1>
      <p style={{ color: "#64748b", marginBottom: 16 }}>{drugs.length} drugs in stock</p>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <button onClick={() => exportPDF(drugs)} style={{ padding: "8px 16px", background: "#c0392b", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}>🖨️ Export PDF</button>
        <button onClick={() => exportExcel(drugs)} style={{ padding: "8px 16px", background: "#1e7e34", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}>📊 Export Excel</button>
        <button onClick={() => exportWord(drugs)} style={{ padding: "8px 16px", background: "#2b579a", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}>📄 Export Word</button>
      </div>
      {drugs.length === 0 ? (
        <p style={{ color: "#64748b" }}>No drugs found. Add some using the form or AI Agent.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Drug Name","Category","Unit","Qty","Cost (₦)","Expiry","Supplier","Status"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: "#64748b", borderBottom: "1px solid #1e2a3a", fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drugs.map((d, i) => (
                <tr key={d.id || i}>
                  <td style={{ padding: "10px 12px", color: "#fff", borderBottom: "1px solid #0f172a", fontWeight: 600 }}>{d.name}</td>
                  <td style={{ padding: "10px 12px", color: "#94a3b8", borderBottom: "1px solid #0f172a" }}>{d.category || "-"}</td>
                  <td style={{ padding: "10px 12px", color: "#94a3b8", borderBottom: "1px solid #0f172a" }}>{d.unit || "-"}</td>
                  <td style={{ padding: "10px 12px", color: "#94a3b8", borderBottom: "1px solid #0f172a" }}>{d.quantity}</td>
                  <td style={{ padding: "10px 12px", color: "#94a3b8", borderBottom: "1px solid #0f172a" }}>{d.cost_price ? `₦${d.cost_price}` : "-"}</td>
                  <td style={{ padding: "10px 12px", color: "#94a3b8", borderBottom: "1px solid #0f172a" }}>{d.expiry_date || "-"}</td>
                  <td style={{ padding: "10px 12px", color: "#94a3b8", borderBottom: "1px solid #0f172a" }}>{d.supplier || "-"}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #0f172a" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: d.status === "In Stock" ? "#22c55e22" : "#ef444422", color: d.status === "In Stock" ? "#22c55e" : "#ef4444" }}>{d.status || "In Stock"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}