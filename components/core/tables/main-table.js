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

export default function MainTable({
  children,
  columns,
  sortFunc = () => {},
  //   func,
  currPage,
  totalPage,
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
        style[columns.indexOf[el]-1] = "block rotate-0";
      } else if (selectToSort.includes("-" + el.field)) {
        style[columns.indexOf[el]-1] = "block rotate-180";
      }
    });
    setArrowState(style);
  };

  useEffect(() => {
    arrow();
  }, [selectToSort]);
  // console.log(arrowState);
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow className="divide-x bg-slate-100">
              {columns.map((el, index) => {
                return (
                  <TableCell
                    onClick={() => {
                      selectHanlder(el.field);
                    }}
                    // style={{backgroundColor:'red'}}
                    align="center"
                    key={index}
                    component={"div"}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <div className="flex w-full gap-1 justify-center items-center text-gray-600  cursor-pointer">
                      <div>{el.name}</div>
                      <div
                        className={`${arrowState[columns.indexOf(el)]} scale-75  transition-all ease-in-out duration-200`}
                      >
                        <Arrow />
                      </div>
                    </div>
                  </TableCell>
                );
              })}
              <TableCell>
               
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{children}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
