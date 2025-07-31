import { useStatus } from "@/components/v2/core/useStatus";
import { url } from "@/components/v2/global/variable";
import { Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const SearchSelect = ({
  title,
  api,
  onSelect,
  add = false,
  initialId = "",
  defaultValue = "",
}) => {
  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);
  const { setError, setSuccess } = useStatus();

  const fetchOptions = async (text = "") => {
    setLoading(true);
    try {
      const res = await fetch(
        `${url}${api}&name=${encodeURIComponent(text.toUpperCase())}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ include: "" }),
        }
      );

      const result = await res.json();
      setResults(result.data || []);
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching options:", error);
      setError("Erreur lors du chargement.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOne = async (id) => {
    try {
      const res = await fetch(`${url}${api.split("?")[0]}/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });

      const result = await res.json();
      if (result && result.name) {
        setQuery(result.name);
        onSelect(result);
      }
    } catch (error) {
      console.error("Error loading initial value:", error);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (val.length >= 1) {
      timeoutRef.current = setTimeout(() => {
        fetchOptions(val);
      }, 150);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleSelect = (opt) => {
    setQuery(opt.name);
    onSelect(opt);
    setShowResults(false);
  };

  const handleAddNew = async () => {
    const targetRoute = api.split("?")[0];
    const name = query.toUpperCase();

    try {
      const existing = results.find((r) => r.name === name);
      if (existing) {
        setError("Cet élément existe déjà.");
        return;
      }

      const res = await fetch(`${url}${targetRoute}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error(await res.text());

      const created = await res.json();
      setSuccess("Élément ajouté !");
      setQuery(created.name);
      onSelect(created);
      setResults([]);
      setShowResults(false);
    } catch (err) {
      console.error("Erreur lors de l'ajout :", err);
      setError("Impossible d'ajouter l'élément.");
    }
  };

  useEffect(() => {
    if (initialId) fetchOne(initialId);
  }, [initialId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="text-lg font-bold">{title}</label>
      <div className="flex gap-2 items-center">
        <input
          className="input w-full"
          value={query}
          onChange={handleChange}
          placeholder={`Rechercher ${title.toLowerCase()}`}
        />
        {add && results.length === 0 && String(query).length > 0 && (
          <button type="button" onClick={handleAddNew} className="btn-r">
            <Plus />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
          {loading && (
            <div className="px-4 py-2 text-sm text-gray-500">Chargement...</div>
          )}
          {!loading && results.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-500">
              Aucun résultat
            </div>
          )}
          {!loading &&
            results.map((opt) => (
              <div
                key={opt.id}
                onClick={() => handleSelect(opt)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {opt.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchSelect;
