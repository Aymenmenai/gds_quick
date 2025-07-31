import React, { useState } from "react";

const FilterSelect = ({ options, select, state }) => {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((a) => a.field === state);

  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center hover:bg-blue-600/5 px-2 rounded-xl"
      >
        <div className="cursor-pointer h-12 min-w-32 flex justify-center items-center">
          {selectedOption?.name}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="white"
          className="cursor-pointer size-4"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {open && (
        <div className="absolute z-30 bg-white shadow w-full mt-2 p-3 rounded-xl">
          {options.map((option, index) => (
            <div
              onClick={() => {
                select(option.field);
                setOpen(false);
              }}
              className="hover:bg-blue-600/5 rounded-lg py-3 px-2 cursor-pointer"
              key={index}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterSelect;
