import {
  Add,
  CheckBox,
  DeleteForever,
  PlusOne,
  Remove,
  Visibility,
} from "@mui/icons-material";
import { Button, IconButton, TableCell, TableRow } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { useQuery } from "react-query";
// import renderDate from "../core/func/date-render";
import MainTable from "../../build/table/base-table";
// import Table from "../../core/tables/table";

import Loading from "../../interface/loading/loading";
import Panel from "../../core/panel/panel";
import Pagination from "../../build/pagination/pagination";
import AutoInput from "@/components/interface/autoInput";
import DialogUI from "@/components/interface/dialog";
import useStoreIds from "@/components/core/store/store";

const AQSSelectTable = () => {
  const stateChanger = useStoreIds((state) => state.selectedArr);
  const ids = useStoreIds((state) => state.ids);

  const rows = ids;
  //   const rows = data.data.data.data;
  // const pages = data.data.data.doc_size;
  //   console.log(data);

  const columns = [
    { field: "reference", name: "Reference" },
    { field: "", name: "Designation" },
    { field: "quantity", name: "Quantite" },
  ];

  const mainFunc = (e) => {
    // console.log(e)
    let newArr = [...ids];
    if (!ids.includes(e)) {
      newArr.push(e);
    } else {
      newArr = [];
      ids.forEach((el) => {
        if (e !== el) {
          newArr.push(el);
        }
      });
    }
    stateChanger([...newArr]);
  };

  return (
    <>
      <MainTable columns={columns} sortFunc={() => {}}>
        {rows.map((row) => {
          return (
            <TableRow hover tabIndex={-1} key={row.id}>
              <TableCell align="center">{row.Ref.name}</TableCell>
              <TableCell align="center">{row.Tag.name}</TableCell>
              <TableCell align="center">
                <div className="flex justify-center items-center gap-2">
                  {row.quantity}
                </div>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => mainFunc(row)}>
                  <DeleteForever />
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })}
      </MainTable>
    </>
  );
};

export default AQSSelectTable;
