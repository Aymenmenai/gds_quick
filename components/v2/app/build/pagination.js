import React, { useEffect, useState } from "react";
import useURL from "@/components/v2/core/useURL";
import { ArrowRight } from "lucide-react";

const Pagination = ({ size }) => {
  const { request, updatePage } = useURL((state) => state);

  const [pageRange, setPageRange] = useState([]);

  useEffect(() => {
    const delta = 2;
    const range = [];

    for (
      let i = Math.max(2, request.page - delta);
      i <= Math.min(size - 1, request.page + delta);
      i++
    ) {
      range.push(i);
    }

    if (request.page - delta > 2) {
      range.unshift("...");
    }
    if (request.page + delta < size - 1) {
      range.push("...");
    }

    range.unshift(1);
    range.push(size);
    setPageRange(range);
  }, [request.page, size]);

  const handleClick = (page) => {
    updatePage(page);
  };

  const handlePrevious = () => {
    updatePage(Math.max(1, request.page - 1));
  };

  const handleNext = () => {
    updatePage(Math.min(size, request.page + 1));
  };

  const isArrayOfOnes = (arr) => {
    return arr.every((element) => element === 1);
  };

  return (
    <>
      {!isArrayOfOnes(pageRange) && (
        <div className="flex flex-row items-center justify-end w-full py-3">
          <button
            className={`btn-r rotate-180 ${
              request.page === 1 ? "opacity-10 cursor-not-allowed" : ""
            }`}
            onClick={handlePrevious}
            disabled={request.page === 1}
          >
            <ArrowRight />
          </button>

          {pageRange.map((page, index) =>
            page === "..." ? (
              <span key={index} className="mx-2 text-blue-600">
                ...
              </span>
            ) : (
              <button
                key={index}
                className={`btn-r size-8 ${
                  request.page === page
                    ? "bg-blue-600 text-white font-bold"
                    : "text-blue-600"
                }`}
                onClick={() => handleClick(page)}
              >
                {page}
              </button>
            )
          )}

          <button
            className={`btn-r ${
              request.page === size ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleNext}
            disabled={request.page === size}
          >
            <ArrowRight />
          </button>
        </div>
      )}
    </>
  );
};

export default Pagination;
