import { TableCell, TableRow } from "@mui/material";
import React from "react";
import RenderRow from "./render-row";
import { useStoreAQS } from "@/components/state/useStoreSortie";

export default function GenerateRow({ data, columns, children, selection }) {
  const { selectedArr, ids } = useStoreAQS((state) => state);
// console.log(data,columns);
  const renderOptions = () => {
    if (children[0]) {
      return (
        <TableCell className="p-1" align="center">
          <div className="flex gap-2 justify-center items-center">
            {children}
          </div>
        </TableCell>
      );
    }
  };

  const condition =
    +data?.alert >= +data?.totalQuantity ? true : false || false;

  return (
    <>
      <TableRow
        className={`${
          condition ? "bg-red-400/30" : "bg-transparent"
        } w-full text-4xl text-gray-300 `}
      >
        <>
          <>
            {selection ? (
              <TableCell align="center">
                <input
                  checked={ids.find((a) => a.id === data.id)}
                  onChange={() => selectedArr(data)}
                  type="checkbox"
                />
              </TableCell>
            ) : (
              <></>
            )}
          </>
          <RenderRow rowData={data} columns={columns} />
          {renderOptions()}
        </>
      </TableRow>
    </>
  );
}
