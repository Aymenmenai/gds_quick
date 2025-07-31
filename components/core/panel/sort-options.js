import React, { useState } from "react";

const SortOptions = ({ sortOptions, currentSort, onSortChange }) => {
  const [sortValue, setSortValue] = useState(currentSort);

  const handleChange = (event) => {
    const value = event.target.value;
    setSortValue(value);
    onSortChange(value);
  };

  return (
    <div>
      <label htmlFor="sort">Sort by:</label>
      <select id="sort" value={sortValue} onChange={handleChange}>
        {sortOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortOptions;
