import useURL from "@/components/v2/core/useURL";
import React, { useEffect, useState } from "react";

const SearchContainer = ({ onchange, state }) => {
  const { where } = useURL((state) => state.request);
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue("");
  }, [where]);

  return (
    <div className="w-full relative">
      <input
        onChange={({ target }) => {
          const upper = target.value.toUpperCase();
          setValue(upper);
          onchange(upper);
        }}
        className="input"
        type="text"
        value={state}
      />
    </div>
  );
};

export default SearchContainer;
