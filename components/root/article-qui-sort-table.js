import { CheckBox, Visibility } from "@mui/icons-material";
import { Checkbox, IconButton, TableCell, TableRow } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { useQuery } from "react-query";
import renderDate from "../core/func/date-render";
import MainTable from "../build/table/base-table";
import Table from "../core/tables/table";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Loading from "../interface/loading/loading";

const ArticleQuiSortTable = () => {
  const [currPage, setCurrPage] = useState(1);
  const [sortBy, setSortBy] = useState("id");
  const [searchBy, setSearchBy] = useState("");
  const { data, refetch, isLoading, isError } = useQuery(
    "articleQuiSort",
    () => {
      // console.log(currPage, "[current.page]");
      return axios.get(`/api/v1/articlequisort/all`);
    },
    {
      manual: true,
    }
  );

  // REQ FOR SEARCHING
  //  const magazin = useQuery(
  //   "magazins",
  //   () => {
  //     return axios.get(
  //       `/api/v1/magazin/all?fields=id,name`
  //     );
  //   }
  // );

  if (isLoading) {
    return <Loading />;
  }

  // if (isError) {
  //   return <>{data}</>
  // }
  // if (isError || magazin.isError) {
  //   return <>Error</>;
  // }
  const rows = data.data.data.data;
  const pages = data.data.data.doc_size;
  // const magazins = magazin.data.data.data.data;
  // console.log(data);

  const currencyFormatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "DA",
  });
  // console.log(rows);
  const columns = [
    { field: "", name: "" },
    // { field: "id", name: "ID" },
    { field: "ReferenceId", name: "Reference" },
    { field: "name", name: "Nom d'article" },
    { field: "date", name: "La date" },
    { field: "price", name: "Prix" },
    { field: "quantity", name: "Quantite" },
    { field: "CategoryId", name: "Category" },
    // { field: "MagazinId", name: "Magazin" },
    { field: "UnitId", name: "Unite" },
    { field: "Sortie.Beneficiare", name: "Le beneficiare" },
  ];

  // FUNC
  // const pageRefetch = (page) => {
  //   setCurrPage(page);
  //   refetch();
  // };
  // const sortRefetch = (arr) => {
  //   setSortBy(arr.join(","));
  //   refetch();
  // };
  return (
    <>
      <MainTable
        columns={columns}
        //   func,
        // currPage ={}
        totalPage={pages}
      >
        {rows.map(row=>{
          return (
            <TableRow
              hover
              // onClick={(event) => handleClick(event, row.name)}
              role="checkbox"
              // aria-checked={isItemSelected}
              tabIndex={-1}
              key={row.id}
              // selected={isItemSelected}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  // checked={isItemSelected}
                  // inputProps={{
                  //   "aria-labelledby": labelId,
                  // }}
                />
              </TableCell>
              {/* <TableCell component="th"  scope="row" padding="none">
                {row.name}
              </TableCell> */}
              <TableCell align="right">{row.Article.Reference.name}</TableCell>
              <TableCell align="right">{row.Article.Brand.name} {row.Article.Tag.name}</TableCell>
              <TableCell align="right">{row.date}</TableCell>
              <TableCell align="right">{row.price}</TableCell>
              <TableCell align="right">{row.quantity}</TableCell>
              <TableCell align="right">{row.Article.Category.name}</TableCell>
              <TableCell align="right">{row.Article.Unit.name}</TableCell>
              <TableCell align="right">{row.Sortie.Beneficiare.name}</TableCell> 
              <TableCell>
                <IconButton>
                  <EditIcon/>
                </IconButton>
                <IconButton>
                  <Visibility/>
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })}




      </MainTable>
    </>
  );
};

export default ArticleQuiSortTable;
