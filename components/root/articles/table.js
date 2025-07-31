import { Autorenew, CheckBox, Visibility } from "@mui/icons-material";
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
import AQSSelectTable from "./aqs-selected-table";
import DesigniationTable from "./designiation-table";
import useStoreIds from "@/components/core/store/store";
import { getDesignation } from "@/components/core/requests/requests";
import { useRouter } from "next/router";
import Input from "@/components/interface/input";

const Article = () => {
  // HARD CODED
  // const arr = [{valule:}]

  const router = useRouter();
  const stateChanger = useStoreIds((state) => state.selectedArr);
  const currIds = useStoreIds((state) => state.ids);

  const [url, setUrl] = useState("/api/v1/article/group?");
  const [currPage, setCurrPage] = useState(1);
  const [desPage, setDesPage] = useState(1);
  const [currData, setCurrData] = useState(1);
  const [ids, setIds] = useState([...currIds]);
  // SEARCHING
  const [items, Setitems] = useState("Tag");
  const [search, setSearch] = useState("");

  // DESINATION
  const currDesignation = useQuery(
    "designations",
    () => {
      return axios.get(
        `/api/v1/article/all?limit=5&Ref.ReferenceId=${currData}&page=${desPage}`
      );
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  // Main Data
  const { data, refetch, isLoading, isError } = useQuery(
    "articles",
    () => {
      // console.log(url+'&'+'sort='+sortBy.join(','))
      // console.log(currPage, "[current.page]");
      return axios.get(`${url}page=${currPage}`);
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  // USEEFFECT
  useEffect(() => {
    refetch();
  }, [currPage]);
  useEffect(() => {
    currDesignation.refetch();
  }, [currData, desPage]);

  // CURRENT DESINAGTION
  if (currDesignation.isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }
  if (currDesignation.isError) {
    return <>Error</>;
  }

  // NORMAL DATA
  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }
  if (isError) {
    return <>Error</>;
  }

  // const rows = d;
  const rows = data.data.data.articles;
  const curr = data?.data?.data.currPage;
  const pages = data?.data?.data.pages;
  // console.log(data.data.data);

  const columns = [
    { field: "id", name: "Reference" },
    { field: "Reference.Ref", name: "Les References compatible" },
    { field: "Reference.Tags", name: "La nature de la piece" },
    { field: "totalQuantity", name: "la quantite total" },
    { field: "alert", name: "Alert" },
    { field: "Reference.Brands", name: "Les marque " },
    { field: "", name: "option " },
  ];

  // FUNC
  // PAGITION
  const paginationFunc = (page) => {
    setCurrPage(page);
  };
  // DES PAGINATION
  const desPaginationFunc = (page) => {
    setDesPage(page);
  };

  // GET NEW URL
  const getNewUrl = (url) => {
    setUrl(url);
    // refetch();
    // console.log("REFRENSH");
  };

  // SEARCHING
  const searchHandler = (index, value) => {
    setSearch(value);
  };

  // GET DATA
  // const DesignationHandler = (id) => {
  //   const data = getDesignation(id);
  //   setCurrData(data);
  // };
  // console.log(rows);

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

  // SEE THE RESULT
  // console.log(currData);
  return (
    <>
      <div className="flex justify-between items-center py-3">
        {/* <Pagination func={setCurrPage} /> */}
        <div className="flex flex-1 px-2 gap-3 justify-center items-center">
          <div className="relative">
            {/* <Button style={{ backgroundColor: "blue" }} variant="contained"> */}
            <DialogUI
              func={() => {
                router.push("/sortie/create");
              }}
              w={"sm"}
              text={"La list des articles pour le sorties"}
            >
              <AQSSelectTable />
            </DialogUI>
            {/* </Button> */}
            {currIds.length > 0 ? (
              <div className="w-2 h-2 bg-red-600 absolute right-0 top-0 scale-150 rounded-full flex justify-center items-center ">
                <div className="w-2 h-2 bg-red-600 absolute  scale-150 rounded-full animate-ping"></div>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-center items-center gap-3">
              <Input
                // type="text"
                label={"Rechercher"}
                func={searchHandler}
                index={"seach"}
              />
              <IconButton onClick={refetch}>
                <Autorenew />
              </IconButton>
            </div>

            {/* <div style={{ display: "grid", gap: "1rem" }}>
              <AutoInput
                field={"id"}
                label={"Chercher par reference"}
                data={[{ id: 1, name: "winner" }]}
                func={() => {}}
                state={""}
              />
            </div> */}
          </div>
        </div>
        {/* <Panel func={getNewUrl} obj={obj} /> */}
      </div>
      <MainTable columns={columns} sortFunc={() => {}}>
        {rows ? (
          rows.map((row) => {
            return (
              <TableRow
                className={`${
                  row.totalQuantity <= row.alert ? "bg-red-500/10" : ""
                }`}
                tabIndex={-1}
                key={row.id}
              >
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">
                  {row.refs ? <>{row.refs.join(",")}</> : <></>}
                </TableCell>
                <TableCell align="center">
                  {row.tags ? <>{row.tags.join(",")}</> : <></>}
                </TableCell>
                <TableCell align="center">{row.totalQuantity}</TableCell>

                <TableCell align="center">{row.alert}</TableCell>
                <TableCell align="center">{row.brands.join(",")}</TableCell>

                <TableCell>
                  <DialogUI
                    text={"Les designiation"}
                    button={true}
                    extraFunc={setCurrData}
                    extraData={row.id}
                    icon={
                      <IconButton>
                        <Visibility />
                      </IconButton>
                    }
                  >
                    <DesigniationTable
                      pageFunc={desPaginationFunc}
                      data={currDesignation}
                    />
                  </DialogUI>
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <></>
        )}
        <Pagination func={paginationFunc} max={pages} curr={curr} />
      </MainTable>
    </>
  );
};

export default Article;
