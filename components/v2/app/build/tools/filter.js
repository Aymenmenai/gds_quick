import React, { useEffect, useRef, useState } from "react";
import useURL from "@/components/v2/core/useURL";
import Search from "./search";
import SearchSelect from "../inputs/search-select";

// Format date as yyyy-MM-dd
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const Filter = ({ tools }) => {
  const fields = tools.panel || [];
  const search = tools.search || [];
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [searchResetTrigger, setSearchResetTrigger] = useState(false);

  const { request, addGTE, addLTE, generateURL, emptyWhere, addWhere } = useURL(
    (state) => state
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Sync filters from Zustand when panel opens
  useEffect(() => {
    if (!open) return;

    const initial = {};

    fields.forEach((f) => {
      const gte = request.gte.find((g) => g.field === f.field)?.value ?? "";
      const lte = request.lte.find((l) => l.field === f.field)?.value ?? "";

      if (f.type === "number-range") {
        initial[f.field] = {
          min: gte || "",
          max: lte || "",
        };
      } else {
        initial[f.field] = {
          from: gte ? String(gte).slice(0, 10) : "",
          to: lte ? String(lte).slice(0, 10) : "",
        };
      }
    });

    setFilters(initial);
  }, [open, fields, request.gte, request.lte]);

  const handleChange = (field, key, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [key]: value,
      },
    }));
  };

  const applyFilters = () => {
    Object.entries(filters).forEach(([key, val]) => {
      const from = val?.from ?? val?.min;
      const to = val?.to ?? val?.max;

      const fromVal =
        from && isNaN(+from) ? formatDate(from) : from ? Number(from) : null;
      const toVal = to && isNaN(+to) ? formatDate(to) : to ? Number(to) : null;

      addGTE(key, fromVal);
      addLTE(key, toVal);
    });

    generateURL();
    setOpen(false);
  };

  const resetFilters = () => {
    const reset = {};

    fields.forEach((f) => {
      reset[f.field] =
        f.type === "number-range" ? { min: "", max: "" } : { from: "", to: "" };

      addGTE(f.field, null);
      addLTE(f.field, null);
    });

    emptyWhere(tools.default_url.where);
    setFilters(reset);
    generateURL();
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn-r stroke-blue-500"
        aria-label="Ouvrir les filtres"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
          />
        </svg>
      </button>

      <div
        className={`fixed inset-0 z-30 transition-opacity duration-200 ${
          open
            ? "opacity-100 pointer-events-auto bg-black/30"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          ref={panelRef}
          className={`absolute right-0 top-0 h-full w-[90%] sm:w-[25%] bg-white shadow-lg transform transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-5 h-full flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-4">Filtres</h2>

            <div className="flex-1 flex flex-col gap-4 overflow-scroll p-1 pb-64">
              {fields.map((field) => {
                const val = filters[field.field] || {};

                if (field.type === "date-range") {
                  return (
                    <div key={field.field} className="flex flex-col gap-1">
                      <label className="font-medium">{field.label}</label>
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={val.from || ""}
                          onChange={(e) =>
                            handleChange(field.field, "from", e.target.value)
                          }
                          className="input w-full"
                        />
                        <input
                          type="date"
                          value={val.to || ""}
                          onChange={(e) =>
                            handleChange(field.field, "to", e.target.value)
                          }
                          className="input w-full"
                        />
                      </div>
                    </div>
                  );
                }

                if (field.type === "number-range") {
                  return (
                    <div key={field.field} className="flex flex-col gap-1">
                      <label className="font-medium">{field.label}</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={val.min || ""}
                          onChange={(e) =>
                            handleChange(field.field, "min", e.target.value)
                          }
                          className="input w-full"
                          placeholder="Minimum"
                        />
                        <input
                          type="number"
                          value={val.max || ""}
                          onChange={(e) =>
                            handleChange(field.field, "max", e.target.value)
                          }
                          className="input w-full"
                          placeholder="Maximum"
                        />
                      </div>
                    </div>
                  );
                }

                return null;
              })}

              {search.map((el, index) => {
                if (el.url) {
                  return (
                    <SearchSelect
                      key={index}
                      title={el.name}
                      api={el.url}
                      onSelect={(value) => {
                        addWhere(el.field, value.id);
                      }}
                    />
                  );
                }
                return <Search key={index} fields={[el]} />;
              })}
            </div>

            <div className="mt-auto flex gap-3">
              <button onClick={resetFilters} className="btn-gray w-full">
                Réinitialiser
              </button>
              <button onClick={applyFilters} className="btn-r w-full">
                Appliquer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Filter;
