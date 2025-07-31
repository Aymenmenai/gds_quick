import React, { useEffect, useState } from "react";
import Dialog from "../containers/dialog";
import { File } from "lucide-react";
import exportToExcel from "./tools/excel";
import { url } from "../../global/variable";

const todayStr = new Date().toISOString().split("T")[0];

const formatDate = (d) =>
  new Date(d).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const ArticleDoc = ({ refId, refName = "REF", link }) => {
  const [start, setStart] = useState("2024-12-31");
  const [end, setEnd] = useState(todayStr);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  console.log(url + link + `/${refId}`);

  const fetchSnapshot = async () => {
    setLoading(true);
    try {
      const res = await fetch(url + link + `/${refId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start, end }),
      });
      const json = await res.json();
      setData(json.data);
    } catch (err) {
      console.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchSnapshot();
  };

  useEffect(() => {
    if (open) fetchSnapshot();
  }, [open]);

  console.log(data);
  return (
    <Dialog
      target={
        <button
          onClick={() => setOpen(true)}
          className="btn-r size-9"
          aria-label="Stock snapshot"
        >
          <File />
        </button>
      }
    >
      {({ close }) => (
        <div className="w-[90svw] max-w-5xl h-[90svh] overflow-y-auto px-6 py-4 space-y-6">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {"📦 Suivi de stock : " + refName}
            </h2>
            <div>
              {data && (
                <button
                  onClick={() =>
                    exportToExcel(
                      refName,
                      data.initialStock,
                      data.movements,
                      data.finalStock
                    )
                  }
                  className="btn-r text-sm mr-2"
                >
                  📤 Exporter en Excel
                </button>
              )}
              <button
                onClick={() => {
                  setOpen(false);
                  close();
                }}
                className="btn-r text-sm"
              >
                ✖ Fermer
              </button>
            </div>
          </div>

          {/* FILTERS */}
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm text-gray-600">
                Date de début
              </label>
              <input
                type="date"
                className="border rounded px-2 py-1 text-sm"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Date de fin</label>
              <input
                type="date"
                className="border rounded px-2 py-1 text-sm"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
            <button onClick={handleFilter} className="btn-r text-sm">
              🔍 Appliquer
            </button>
          </div>

          {/* BODY */}
          {!loading && data && (
            <>
              {/* INITIAL STOCK */}
              <div>
                <h3 className="font-semibold mb-2">
                  🔹 Stock Initial au {formatDate(start)}
                </h3>
                <table className="w-full text-sm border ring-1 ring-gray-300 rounded">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left px-3 py-2">Article</th>
                      <th className="text-left px-3 py-2">Prix (DA)</th>
                      <th className="text-right px-3 py-2">Quantité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.initialStock &&
                      data.initialStock.map((item, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-3 py-2">{item.name}</td>
                          <td className="px-3 py-2">{item.price}</td>
                          <td className="px-3 py-2 text-right font-medium">
                            {item.quantity}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* MOVEMENTS */}
              <div>
                <h3 className="font-semibold mb-2">
                  🔁 Mouvements du {formatDate(start)} au {formatDate(end)}
                </h3>
                <div className="space-y-2">
                  {data.movements &&
                    data.movements.map((event, idx) => {
                      const typeStyle =
                        event.type === "entree"
                          ? "bg-green-50 text-green-800"
                          : event.type === "sortie"
                          ? "bg-red-50 text-red-800"
                          : "bg-blue-50 text-blue-800";

                      const movement =
                        event.movement_quantity ?? event.quantity ?? 0;

                      const movementColor =
                        movement < 0
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700";

                      const label =
                        event.type === "countage"
                          ? "🧾 Inventaire"
                          : `${
                              event.type === "entree"
                                ? "📥 Entrée"
                                : "📤 Sortie"
                            } ${
                              event.bon_number ? `N°${event.bon_number}` : ""
                            }`;

                      return (
                        <div
                          key={idx}
                          className={`flex justify-between items-center rounded-md px-3 py-2 ${typeStyle}`}
                        >
                          {/* Type */}
                          <div className="text-sm font-medium w-[160px]">
                            {label}
                          </div>

                          {/* Article & Partner */}
                          <div className="text-sm text-gray-800 flex-1">
                            {event.article?.name || event.comment || "—"}
                            {event.article?.price !== null && (
                              <span className="ml-1 text-xs text-gray-500">
                                ({event.article?.price} DA)
                              </span>
                            )}
                            {(event.fournisseur || event.beneficiaire) && (
                              <span className="ml-2 text-xs text-gray-500">
                                {event.fournisseur || event.beneficiaire}
                              </span>
                            )}
                          </div>

                          {/* Movement + Start → End */}
                          <div className="text-sm text-right w-[120px]">
                            <div
                              className={`inline-block px-2 py-1 rounded text-xs font-semibold ${movementColor}`}
                            >
                              {movement}
                            </div>
                            {event.start_quantity !== undefined &&
                              event.stock_at_date !== undefined && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {event.start_quantity} → {event.stock_at_date}
                                </div>
                              )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* FINAL STOCK */}
              <div>
                <h3 className="font-semibold mb-2">
                  ✅ Stock Final au {formatDate(end)}
                </h3>
                <table className="w-full text-sm border ring-1 ring-gray-300 rounded">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left px-3 py-2">Article</th>
                      <th className="text-left px-3 py-2">Prix (DA)</th>
                      <th className="text-right px-3 py-2">Quantité</th>
                      <th className="text-right px-3 py-2">➕ Ajustement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.finalStock &&
                      data.finalStock.map((item, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-3 py-2">{item.name}</td>
                          <td className="px-3 py-2">{item.price}</td>
                          <td className="px-3 py-2 text-right font-medium">
                            {item.quantity}
                          </td>
                          <td className="px-3 py-2 text-right text-green-600 font-semibold">
                            {item.extra_quantity
                              ? "+" + item.extra_quantity
                              : "—"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </Dialog>
  );
};

export default ArticleDoc;
