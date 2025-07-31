import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const exportToExcel = (refName, initialStock, movements, finalStock) => {
  const wb = XLSX.utils.book_new();

  // ✅ 1. Stock Initial
  const initialSheet = XLSX.utils.json_to_sheet(
    initialStock.map((item) => ({
      Article: item.name,
      "Prix (DA)": item.price,
      "Quantité Initiale": item.quantity,
    }))
  );
  XLSX.utils.book_append_sheet(wb, initialSheet, "Stock Initial");

  // ✅ 2. Mouvements
  const movementSheet = XLSX.utils.json_to_sheet(
    movements.map((m) => {
      const label =
        m.type === "countage"
          ? "Inventaire"
          : `${m.type === "entree" ? "Entrée" : "Sortie"}${
              m.bon_number ? ` N°${m.bon_number}` : ""
            }`;

      const partner = m.fournisseur || m.beneficiaire || "—";

      return {
        Type: label,
        Date: formatDate(m.date),
        Article:
          m.article && m.article.name ? m.article.name : m.comment || "—",
        Référence: m.article && m.article.ref ? m.article.ref : "—",
        "Prix (DA)":
          m.article && m.article.price != null ? m.article.price : "—",
        "Quantité Mvt":
          m.movement_quantity != null
            ? m.movement_quantity
            : m.quantity != null
            ? m.quantity
            : "—",
        Départ: m.start_quantity != null ? m.start_quantity : "—",
        "Stock à Date": m.stock_at_date != null ? m.stock_at_date : "—",
        "N° Bon": m.bon_number || "—",
        "Fournisseur / Bénéficiaire": partner,
      };
    })
  );
  XLSX.utils.book_append_sheet(wb, movementSheet, "Mouvements");

  // ✅ 3. Stock Final
  const finalSheet = XLSX.utils.json_to_sheet(
    finalStock.map((item) => ({
      Article: item.name,
      "Prix (DA)": item.price,
      "Quantité Finale": item.quantity,
      "Ajustement (+)": item.extra_quantity != null ? item.extra_quantity : "—",
    }))
  );
  XLSX.utils.book_append_sheet(wb, finalSheet, "Stock Final");

  // ✅ Export
  const filename = `SuiviStock_${refName}_${new Date()
    .toISOString()
    .slice(0, 10)}.xlsx`;
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([wbout], { type: "application/octet-stream" }), filename);
};

export default exportToExcel;
