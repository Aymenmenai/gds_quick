import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import React, { useState, useEffect } from "react";

const Pagination = ({ curr = 1, max, func = () => {} }) => {
  const [pageRange, setPageRange] = useState([]);

  useEffect(() => {
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(2, curr - delta);
      i <= Math.min(max - 1, curr + delta);
      // i <= Math.min(max - 1, curr + delta);
      i++
    ) {
      range.push(i);
    }
    if (curr - delta > 2) {
      range.unshift("...");
    }
    if (curr + delta < max - 1) {
      range.push("...");
    }
    range.unshift(1);
    range.push(max);
    setPageRange(range);
  }, [curr, max]);

  const handleClick = (page) => {
    func(page);
  };

  const handlePrevious = () => {
    if (curr - 1 < 1) {
      func(1);
    } else {
      func(curr - 1);
    }
  };

  const handleNext = () => {
    if (curr + 1 > max) {
      func(max);
    } else {
      func(curr + 1);
    }
  };

  // check if element is duplicated
  function isArrayOfOnes(arr) {
    return arr.every(function (element) {
      return element === 1;
    });
  }
  // console.log(pageRange, [1, 1]);
  return (
    <>
      {!isArrayOfOnes(pageRange) ? (
        <div className="flex flex-row items-center justify-center ">
          <nav className="gap-2 flex flex-row items-center justify-center rounded-lg bg-white overflow-hidden ">
            <button
              className={`${
                curr === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-200"
              } px-1 py-2 rounded-l-lg rounded-r-lg`}
              onClick={handlePrevious}
              disabled={curr === 1}
            >
              <ArrowLeft />
            </button>
            {pageRange.map((page, index) => {
              if (page === "...") {
                return (
                  <span key={index} className="mx-2">
                    ...
                  </span>
                );
              } else {
                return (
                  <button
                    key={index}
                    className={`${
                      curr === page ? "bg-gray-200 " : "hover:bg-gray-200"
                    } px-3 py-2 rounded-l-lg rounded-r-lg`}
                    onClick={() => handleClick(page)}
                  >
                    {page}
                  </button>
                );
              }
            })}
            <button
              className={`${
                curr === max
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-200"
              } px-1 py-2 rounded-l-lg rounded-r-lg`}
              onClick={handleNext}
              disabled={curr === max}
            >
              <ArrowRight />
            </button>
          </nav>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Pagination;
