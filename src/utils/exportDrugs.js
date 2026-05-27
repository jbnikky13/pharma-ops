import * as XLSX from "xlsx";

const getRows = (drugs) => drugs.map(d => ({
  "Drug Name": d.name || "-",
  "Category": d.category || "-",
  "Unit": d.unit || "-",
  "Quantity": d.quantity || 0,
  "Reorder Level": d.reorder_level || "-",
  "Cost Price (N)": d.cost_price || "-",
  "Expiry Date": d.expiry_date || "-",
  "Supplier": d.supplier || "-",
  "Status": d.status || "-"
}));

export const exportExcel = (drugs) => {
  const ws = XLSX.utils.json_to_sheet(getRows(drugs));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Inventory");
  XLSX.writeFile(wb, "PharmaOps_Inventory.xlsx");
};

export const exportPDF = (drugs) => {
  const rows = drugs.map(d => `<tr><td>${d.name||"-"}</td><td>${d.category||"-"}</td><td>${d.quantity||0}</td><td>${d.cost_price||"-"}</td><td>${d.expiry_date||"-"}</td><td>${d.supplier||"-"}</td></tr>`).join("");
  const w = window.open("", "_blank");
  w.document.write(`<html><head><title>PharmaOps Inventory</title><style>body{font-family:Arial,sans-serif;padding:20px}h2{color:#00c853}table{width:100%;border-collapse:collapse;margin-top:16px}th{background:#0d1117;color:#00c853;padding:8px;text-align:left}td{padding:8px;border-bottom:1px solid #ddd}tr:nth-child(even){background:#f9f9f9}</style></head><body><h2>PharmaOps Inventory Report</h2><p>Generated: ${new Date().toLocaleString()} | Total: ${drugs.length} drugs</p><table><thead><tr><th>Drug Name</th><th>Category</th><th>Qty</th><th>Cost</th><th>Expiry</th><th>Supplier</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 500);
};

export const exportWord = (drugs) => {
  const rows = drugs.map(d => `<tr><td style="border:1px solid #ccc;padding:6px">${d.name||"-"}</td><td style="border:1px solid #ccc;padding:6px">${d.category||"-"}</td><td style="border:1px solid #ccc;padding:6px">${d.quantity||0}</td><td style="border:1px solid #ccc;padding:6px">${d.cost_price||"-"}</td><td style="border:1px solid #ccc;padding:6px">${d.expiry_date||"-"}</td><td style="border:1px solid #ccc;padding:6px">${d.supplier||"-"}</td></tr>`).join("");
  const html = `<html xmlns:w='urn:schemas-microsoft-com:office:word'><body><h2 style="color:#00c853">PharmaOps Inventory Report</h2><p>Generated: ${new Date().toLocaleString()} | Total: ${drugs.length} drugs</p><table style="width:100%;border-collapse:collapse"><tr style="background:#0d1117;color:#fff"><th style="border:1px solid #ccc;padding:6px">Drug Name</th><th style="border:1px solid #ccc;padding:6px">Category</th><th style="border:1px solid #ccc;padding:6px">Qty</th><th style="border:1px solid #ccc;padding:6px">Cost</th><th style="border:1px solid #ccc;padding:6px">Expiry</th><th style="border:1px solid #ccc;padding:6px">Supplier</th></tr>${rows}</table></body></html>`;
  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "PharmaOps_Inventory.doc";
  a.click();
};
