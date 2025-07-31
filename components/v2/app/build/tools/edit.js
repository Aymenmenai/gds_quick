import React, { useState } from "react";
import Dialog from "../../containers/dialog";
import { Pencil } from "lucide-react";
import { url } from "@/components/v2/global/variable";
import { useStatus } from "@/components/v2/core/useStatus";
import Default from "../inputs/default";
import AutoValue from "../inputs/auto-value";
import SearchSelect from "../inputs/search-select";

// ✅ Utils to handle nested value access
const getNestedValue = (obj, path) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

const setNestedValue = (obj, path, value) => {
  const keys = path.split(".");
  const lastKey = keys.pop();
  const newObj = { ...obj };
  let current = newObj;

  for (const key of keys) {
    current[key] = { ...(current[key] || {}) };
    current = current[key];
  }

  if (lastKey) current[lastKey] = value;

  return newObj;
};

// ✅ Deep diff utility
const getChangedFields = (original, updated) => {
  const changes = {};

  for (const key in updated) {
    const updatedValue = updated[key];
    const originalValue = original[key];

    if (
      typeof updatedValue === "object" &&
      updatedValue !== null &&
      !Array.isArray(updatedValue)
    ) {
      const nestedChanges = getChangedFields(originalValue || {}, updatedValue);
      if (Object.keys(nestedChanges).length > 0) {
        changes[key] = nestedChanges;
      }
    } else if (updatedValue !== originalValue) {
      changes[key] = updatedValue;
    }
  }

  return changes;
};

const Edit = ({ forms, route, initial_data, refresh }) => {
  const { setSuccess, setError } = useStatus();
  const [data, setData] = useState(initial_data);

  const handleUpdate = async () => {
    try {
      const diff = getChangedFields(initial_data, data);
      const res = await fetch(`${url}${route}/${initial_data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(diff),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Échec de la mise à jour.");
      }

      setSuccess("Mise à jour réussie !");
      // refresh();

      return 0;
    } catch (err) {
      console.error("Update Error:", err);
      setError(err.message || "Erreur lors de la mise à jour.");
    }
  };

  return (
    <Dialog
      target={
        <button className="btn-r text-blue-500 " aria-label="Modifier">
          <Pencil className="h-6 w-6" />
        </button>
      }
    >
      {({ close }) => (
        <form
          className="flex flex-col h-full justify-between z-[999] items-center"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate().then(() => close());
          }}
        >
          <div className="text-2xl font-bold mb-4">Modifier l'élément</div>

          <div
            className={`${
              forms.length > 5 ? "grid-cols-2" : "grid-cols-1"
            } w-full py-6 px-3 flex-1 place-content-start grid gap-4`}
          >
            {forms.map((el) => {
              const path = el.field;
              const value = getNestedValue(data, path);

              if (el.auto) {
                return (
                  <AutoValue
                    key={el.id}
                    api={el.url}
                    title={el.name}
                    initialValue={value}
                    func={(val) =>
                      setData((prev) => setNestedValue(prev, path, val))
                    }
                  />
                );
              }

              if (el.select) {
                return (
                  <SearchSelect
                    key={el.id}
                    api={el.url}
                    title={el.name}
                    add={el.add}
                    defaultValue={
                      initial_data[
                        el.value.replace("Id", "_name").toLowerCase()
                      ]
                    }
                    initialId={value}
                    onSelect={(val) =>
                      setData((prev) => setNestedValue(prev, path, val.id))
                    }
                  />
                );
              }

              return (
                <Default
                  key={el.id}
                  type={el.type}
                  title={el.name}
                  initialValue={value}
                  func={(val) =>
                    setData((prev) => setNestedValue(prev, path, val))
                  }
                />
              );
            })}
          </div>

          <div className="w-full flex justify-between gap-2 mt-6">
            <button type="button" onClick={close} className="btn-sec w-1/2">
              Annuler
            </button>
            <button type="submit" className="btn-pri w-1/2">
              Enregistrer
            </button>
          </div>
        </form>
      )}
    </Dialog>
  );
};

export default Edit;
