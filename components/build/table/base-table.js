import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// import TablePagination from "@mui/material/TablePagination";
import { useState } from "react";
import Arrow from "@/components/design/arrow";
import { useEffect } from "react";
import ArrowUp from "@/components/design/icons/arrowup";
import TableColumn from "./table-column";

export default function BaseTable({
  children,
  columns,
  sortFunc = () => {},
  //   func,
  option,
  selection,
}) {
  const [selectToSort, setSelectToSort] = useState([]);
  const [arrowState, setArrowState] = useState("hidden");

  const selectHanlder = (e) => {
    const newArr = [...selectToSort];
    let clean = newArr;

    if (newArr.includes(e)) {
      clean[clean.indexOf(e)] = `-${e}`;
    } else if (newArr.includes(`-${e}`)) {
      clean.splice(clean[clean.indexOf(`-${e}`)], 1);
    } else {
      clean.push(`${e}`);
    }
    setSelectToSort([...clean]);
    sortFunc(clean);
  };

  // BEAUTIFY CONDITIONS
  // ARROW
  const arrow = () => {
    let style = new Array(columns.length).fill("hidden");
    // console.log(style.)
    columns.map((el) => {
      if (selectToSort.includes(el.field)) {
        style[columns.indexOf[el] - 1] = "block rotate-0";
      } else if (selectToSort.includes("-" + el.field)) {
        style[columns.indexOf[el] - 1] = "block rotate-180";
      }
    });
    setArrowState(style);
  };

  useEffect(() => {
    arrow();
  }, [selectToSort]);
  // console.log(arrowState);
  return (
    <div className="relative bg-white border rounded-lg h-full overflow-hidden">
      <TableContainer
        component={Paper}
        className="h-full shadow-none pb-16" // Adjust the maximum height as needed
      >
        <Table size="small">
          <TableHead className="sticky top-0 z-10 w-full bg-green-600">
            <TableRow className="divide-x  bg-blue-500">
              {selection ? (
                <TableCell align="center" style={{ width: "5%" }}>
                  <div className="text-white font-semibold">{""}</div>
                </TableCell>
              ) : (
                <></>
              )}
              {columns.map((el, index) => {
                return (
                  <TableColumn
                    key={index}
                    value={el.name}
                    onClick={() => selectHanlder(el.field)}
                  />
                );
              })}
              {option ? (
                <TableCell align="center" style={{ width: "10%" }}>
                  <div className="text-white font-semibold">{"OPTIONS"}</div>
                </TableCell>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>{children}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
