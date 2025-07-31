import { CheckBox, Visibility } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  IconButton,
  TableCell,
  TableRow,
} from "@mui/material";
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
import AQSSelectTable from "./aqs-selected-table";
import { getDesignation } from "@/components/core/requests/requests";
import useStoreIds from "@/components/core/store/store";

const DesigniationTable = ({ data, pageFunc }) => {
  // const [ids, setIds] = useState(id);
    const stateChanger = useStoreIds((state) => state.selectedArr);

  const ids = useStoreIds((state) => state.ids);
  const [selectedIds, setSelectedIds] = useState([...ids]);

  // // Main Data
  // const data = getDesignation(ids);

  // console.log(data,'[----- MAIN ----- ]');

  if (data.isError) {
    return <>{data}</>;
  }
  if (data.isLoading) {
    return <>'Loading'</>;
  }

  // const rows = d
  const rows = data.data.data.data.data;
  const curr = data?.data?.data?.data.currPage;
  const pages = data?.data?.data?.data.pages;
  // const pages = data.data.data.doc_size;
  // console.log(data.data.data, "[from desigantion]");

  const columns = [
    { field: "", name: "" },
    { field: "Reference.name", name: "Reference" },
    { field: "designatiam", name: "Destignation" },
    { field: "quantity", name: "Quantite" },
    { field: "price", name: "Prix" },
    { field: "Entree.Fournisseur", name: "Fournisseur" },
  ];

  // CREATE OBJ FOR PANCEL
  const obj = {
    removeTime: true,
    select: [
      {
        title: "main",
        field: "Tag",
        data: ["pompe a hui", "19j jjs"],
      },
    ],
  };

  // SET IDS
  // CHECK IF ELEMENT
  const mainFunc = (e) => {
    // console.log(e)
    let newArr = [...ids];
    if (!selectedIds.includes(e)) {
      newArr.push(e);
    } else {
      newArr = [];
      ids.forEach((el) => {
        if (e !== el) {
          newArr.push(el);
        }
      });
    }
    setSelectedIds(newArr);
  };

  useEffect(() => {
    stateChanger(selectedIds);
  }, [selectedIds]);
  // SEE THE RESULT
  // console.log(selectedIds, "URL");
  return (
    <>
      <MainTable columns={columns} sortFunc={() => {}}>
        {rows.map((row) => {
          return (
            <TableRow hover tabIndex={-1} key={row.id}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={ids.includes(row)}
                  onClick={() => mainFunc(row)}
                />
              </TableCell>

              <TableCell align="center">{row.Ref.name}</TableCell>
              <TableCell align="center">
                {" "}
                {row.Tag?.name} {row.Brand?.name}
              </TableCell>
              <TableCell align="center">{row.quantity}</TableCell>
              <TableCell align="center">{row.price}</TableCell>
              <TableCell align="center">
                {row.Entree.Fournisseur.name}
              </TableCell>

              <TableCell>
                <DialogUI
                  text={"Les designiation"}
                  button={false}
                  icon={
                    <IconButton>
                      <Visibility />
                    </IconButton>
                  }
                ></DialogUI>
              </TableCell>
            </TableRow>
          );
        })}
      </MainTable>
      <Pagination func={pageFunc} max={pages} curr={curr} />
    </>
  );
};

export default DesigniationTable;
