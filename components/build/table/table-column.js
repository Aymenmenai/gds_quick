import ArrowUp from "@/components/design/icons/arrowup";
import { TableCell } from "@mui/material";
import React from "react";

export default function TableColumn({onClick,value}) {
  return (
    <TableCell
      onClick={onClick}
      align="center"
      component={"div"}
      // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <div className="flex w-full gap-1 justify-center items-center text-white font-extralight  cursor-pointer">
        <div className="uppercase ">{value}</div>
        <div
          className={`scale-75 textw transition-all ease-in-out duration-200`}
        >
          {/* <ArrowUp /> */}
        </div>
      </div>
    </TableCell>
  );
}
