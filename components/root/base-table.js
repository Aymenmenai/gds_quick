import { Autorenew } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  IconButton,
  TableCell,
  TableRow,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import MainTable from "../build/table/base-table";
import EditIcon from "@mui/icons-material/Edit";
import Panel from "../core/panel/panel";
import Pagination from "../build/pagination/pagination";
import ArticleRow from "../core/tables/rows/article-row";
import { useQuery } from "react-query";
import RowComponent from "../core/tables/rows/row-component";
import { useRouter } from "next/router";
import useStoreIds from "../core/store/store";
import Input from "../interface/input";
import MainBtn from "../interface/btn/main-btn";
import StandardInput from "../base/input/standard-input";

const BaseTable = ({
  func = () => {},
  id,
  root = "article",
  obj = false,
  columns = [],
  max = 10000,
  updateFunc = false,
  searchingCase = "name",
  urlExtra = "",
}) => {
  const router = useRouter();
  const number = useStoreIds((state) => state.ids);

  // STATES
  const [url, setUrl] = useState(`/api/v1/${root}/all?${urlExtra}`);
  const [currPage, setCurrPage] = useState(1);
  const [sortBy, setSortBy] = useState([]);
  const [search, setSearch] = useState("");

  const [ids, setIds] = useState([]);
  // const PAGE_SIZE = 3;

  const urlChecker = (u) => (u.endsWith("?") ? "" : "&");

  const fetchArticles = () => {
    const condition = urlChecker(url);
    let sort =
      typeof sortBy === "object" || sortBy === ""
        ? ""
        : `${urlChecker(condition)}sort=${sortBy}`;
    const urlWithSorting = url + sort;

    const page = `${urlChecker(urlWithSorting)}page=${currPage}`;
    // console.log(
    //   url + page + sort + `${!search ? "" : `&${searchingCase}=${search}`}`
    // );
    return axios.get(
      url + page + sort + `${!search ? "" : `&${searchingCase}=${search}`}`
    );
  };

  // MAIN DATA
  const { data, isLoading, isError, refetch } = useQuery(
    [`${root}s`, currPage],
    fetchArticles,
    {
      keepPreviousData: true,
    }
  );

  // COLLECT IDS
  const collectIds = (id) => {
    if (ids.includes(id)) {
      i;
    }
    // console.log(id);
  };

  // SEARCHING
  const searchHanlder = (index, value) => {
    setSearch(value);
  };

  // PAGINATION
  const paginationFunc = (page) => {
    setCurrPage(page);
  };
  const getNewUrl = (url) => {
    setUrl(url);
    // refetch();
    // console.log("REFRESH");
  };
  const sortRefetch = (arr) => {
    setSortBy(arr.join(","));
    // refetch();
  };

  useEffect(() => {
    setCurrPage(1);
  }, [url, search]);
  useEffect(() => {
    refetch();
    // console.log(sortBy, "doisjfoiudyfui");

    // setUrl(url + mainUrl);
  }, [sortBy, url, currPage, search]);

  // VIEW
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {isError.message}</div>;
  }

  const rows = data?.data?.data?.data;
  const curr = data.data.data.currPage;
  const pages = data.data.data.pages;

  return (
    <>
      <div className="flex gap-3 justify-start items-center flex-row-reverse py-3">
        <Panel func={getNewUrl} root={root} obj={obj} />
        <IconButton onClick={() => setUrl(`/api/v1/${root}/all?`)}>
          <Autorenew />
        </IconButton>
        {root === "article" ? (
          <>
            <MainBtn func={() => router.push("/sortie/create")}>
              <div>{"Passer à la sortie"}</div>
              <div className="py-2 px-2 absolute -top-4 -right-2 rounded-full bg-red-600  font-bold scale-50 text-white ">
                {number.length}
              </div>
            </MainBtn>
          </>
        ) : (
          <></>
        )}
        {searchingCase ? (
          <div className="flex-1 flex gap-2 items-center justify-center">
            <StandardInput
              type="text"
              label={"Rechercher"}
              onChange={searchHanlder}
              index={"name"}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      <MainTable columns={columns} sortFunc={sortRefetch}>
        <RowComponent
          id={id}
          refetch={refetch}
          root={root}
          rows={rows}
          func={collectIds}
          updateFunc={updateFunc}
          thirdFunc={func} // FUNCTION FOR SORTIE TO COLLECTED NOW ARTICLES
        />
      </MainTable>
      <Pagination func={paginationFunc} max={pages} curr={curr} />
    </>
  );
};

export default BaseTable;
