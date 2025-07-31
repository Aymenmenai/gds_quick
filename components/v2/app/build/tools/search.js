import React, { useEffect, useState } from "react";
import SearchContainer from "../filters/search-container";
import FilterSelect from "../filters/filter-select";
import useURL from "@/components/v2/core/useURL";
import { X } from "lucide-react";

const Search = ({ fields }) => {
  const { request, addWhere, removeWhere } = useURL((state) => state);

  const [where, setWhere] = useState({
    name: fields[0]?.field || "",
    value: "",
  });

  // Set default from Zustand's `where`
  useEffect(() => {
    if (!fields.length) return;

    const defaultField = fields[0]?.field || "";
    const existing = request.where.find((w) => w.name === defaultField);

    setWhere({
      name: defaultField,
      value: existing?.value ?? "",
    });
  }, [fields, request.where]);

  // Apply filter automatically on value change
  useEffect(() => {
    const index = request.where.findIndex((w) => w.name === where.name);
    if (where.value) {
      addWhere(where.name, where.value);
    } else if (index !== -1) {
      removeWhere(index);
    }
  }, [where.name, where.value]);

  const nameHandler = (value) => {
    const existing = request.where.find((w) => w.name === value);
    setWhere({
      name: value,
      value: existing?.value ?? "",
    });
  };

  const valueHandler = (value) => {
    setWhere((prev) => ({ ...prev, value }));
  };

  const clearHandler = () => {
    setWhere((prev) => ({ ...prev, value: "" }));
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="font-medium">{fields[0].name}</label>
      <div className="flex">
        <SearchContainer state={String(where.value)} onchange={valueHandler} />
        {where.value && (
          <button
            onClick={clearHandler}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
