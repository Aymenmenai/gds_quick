import { url } from "@/components/v2/global/variable";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

const AutoValue = ({ title, api, func, initialValue }) => {
  const [value, setValue] = useState(initialValue ?? 0);
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const start = `'01-01-${currentYear}'`;
  const end = `'31-12-${currentYear}'`;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${url}${api}&date[gte]=${start}&date[lte]=${end}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ include: "" }),
        }
      );

      if (!res.ok) throw new Error("Request failed");

      const result = await res.json();
      const newVal = (result?.data?.[0]?.number ?? 0) + 1;
      setValue(newVal);
      func(newVal);
    } catch (err) {
      console.error("AutoValue fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialValue == null) {
      fetchData();
    } else {
      func(initialValue);
    }
  }, [initialValue]);

  return (
    <div className="flex items-end w-full mt-3">
      <div className="w-full">
        <label className="text-lg font-bold block mb-1">{title}</label>
        <div className="flex items-center gap-2">
          <div className="input h-12 flex-1 flex items-center bg-gray-50 text-black select-none cursor-default">
            {value}
          </div>
          <button
            type="button"
            className="btn-r"
            onClick={fetchData}
            disabled={loading}
            title="Recharger"
          >
            <RefreshCcw />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoValue;
