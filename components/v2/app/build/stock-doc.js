import React, { useEffect, useState } from "react";
import Dialog from "../containers/dialog";
import { File } from "lucide-react";
import { url } from "@/components/v2/global/variable";

// Utility: format date as DD/MM/YYYY
const formatDate = (d) =>
  new Date(d).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

// Utility: color class by event type
const getColor = (type) => {
  switch (type) {
    case "entree":
      return "bg-green-100 text-green-700";
    case "sortie":
      return "bg-red-100 text-red-700";
    case "countage":
    default:
      return "bg-blue-100 text-blue-700";
  }
};

const StockDoc = ({ refId, refName = "REF", link }) => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  // console.log(url + link + `/${refId}`);
  const fetchTimeline = async () => {
    if (!refId || !link) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url + link + `/${refId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erreur lors du chargement");
      const json = await res.json();
      setTimeline(json.data?.timeline || []);
    } catch (err) {
      setError("Erreur de chargement du stock.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchTimeline();
    }
  }, [open, refId]);

  return (
    <Dialog
      target={
        <button
          onClick={() => setOpen(true)}
          className="btn-r size-9"
          aria-label="Stock timeline"
        >
          <File />
        </button>
      }
    >
      {({ close }) => (
        <div className="w-[90svw] max-w-4xl h-[90svh] overflow-y-auto px-6 py-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">
              {"LE SUIVI D'ARTICLE : " + refName}
            </h2>
            <button
              onClick={() => {
                setOpen(false);
                close();
              }}
              className="btn-r text-sm"
            >
              Fermer
            </button>
          </div>

          {loading && <p className="text-sm">Chargement...</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {!loading &&
            !error &&
            timeline.map((segment, i) => (
              <div
                key={i}
                className="border rounded-lg shadow-sm p-3 bg-white space-y-2"
              >
                <div className="text-xs text-muted-foreground mb-2">
                  📆 Du {formatDate(segment.from)}{" "}
                  {segment.to
                    ? `au ${formatDate(segment.to)}`
                    : "jusqu'à aujourd'hui"}
                </div>

                <div className="space-y-3">
                  {segment.events.map((event, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between border-l-4 pl-4 py-2 ${getColor(
                        event.type
                      )}`}
                    >
                      <div className="text-sm font-medium w-[100px]">
                        {event.type === "countage"
                          ? "🧾 INVENTAIRE"
                          : event.type === "entree"
                          ? "📥 ENTRÉE"
                          : "📤 SORTIE"}
                      </div>

                      <div className="text-sm w-[120px]">
                        {formatDate(event.date)}
                      </div>

                      <div className="text-sm flex-1">
                        {event.article?.name || event.comment || "—"}
                      </div>

                      <div className="text-sm w-[50px] text-center">
                        {event.movement_quantity ?? event.quantity}
                      </div>

                      <div className="text-sm font-semibold w-[60px] text-right">
                        📦 {event.stock_at_date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </Dialog>
  );
};

export default StockDoc;
