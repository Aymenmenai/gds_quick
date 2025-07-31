import { Autorenew, Delete } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";

import { IconButton, TableCell } from "@mui/material";
import Input from "@/components/interface/input";
import { TableRow } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import MainTable from "@/components/core/tables/main-table";
import Loading from "@/components/interface/loading/loading";
import Res from "@/components/interface/res/res";
import ResDelete from "@/components/interface/res/res-delete";
import DialogUI from "@/components/interface/dialog";
import ResUpdate from "@/components/interface/res/res-update";
import RelatedForm from "../core/form/related-form";
import Pagination from "../build/pagination/pagination";

const RefRootBase = ({
  position = false,
  i = false,
  main = "ref",
  // second = "ref",
  index = "ReferenceId",
  arr = "Refs",
}) => {
  const [id, setId] = useState(1);
  const [currPage, setCurrPage] = useState(1);

  const [search, setSearch] = useState("");

  const { data, isLoading, refetch } = useQuery(
    main,
    () => {
      return axios.get(
        `/api/v1/${main}/all?sort=-id&page=${currPage}${
          !search ? "" : `&search=${search}`
        }`
      );
    },

    {
      refetchOnWindowFocus: false,
    }
  );

  const [input, setInput] = useState({});
  const [updatedData, setUpdatedData] = useState({});

  const setValue = (index, value) => {
    setInput({ [index]: value.toUpperCase() });
  };

  const searchHanlder = (index, value) => {
    setSearch(value);
  };

  // PAGINATION
  const paginationFunc = (page) => {
    setCurrPage(page);
  };

  useEffect(() => {
    refetch();
  }, [input, search, currPage]);

  if (isLoading) {
    return <Loading />;
  }

  // console.log(data)
  const rows = data.data.data.data;
  const curr = data?.data?.data.currPage;
  const pages = data?.data?.data.pages;

  const columns = [
    { field: "name", name: "Référence de la société (RS)" },
    { field: "References", name: "Références compatibles" },
    { field: "alert", name: "L'alerte" },
  ];

  const getUpdateData = (d) => {
    setUpdatedData(d);
  };
  // console.log(input,main);
  // console.log(!search, "EMPTY");

  return (
    <>
      <div className="flex justify-between items-center py-2">
        <div className="flex justify-center items-center gap-3">
          {i ? (
            <>
              <Input type="text" label={"Nom"} func={setValue} index={"name"} />
            </>
          ) : (
            <></>
          )}

          <Res url={main} data={input} refetch={refetch} />
        </div>
        <div className="flex justify-center items-center gap-3">
          <Input
            type="text"
            label={"Rechercher"}
            func={searchHanlder}
            index={"search"}
          />
          <IconButton onClick={refetch}>
            <Autorenew />
          </IconButton>
        </div>
      </div>
      <MainTable columns={columns}>
        {rows.map((row) => {
          return (
            <TableRow hover tabIndex={-1} key={row.id}>
              {/* <TableCell align="center">{rows.indexOf(row) + 1}</TableCell> */}
              <TableCell align="center">
                <div className="font-semibold">{row.name}</div>
              </TableCell>
              <TableCell align="center">
                {row[arr]?.length > 0 ? (
                  <div className="text-left flex justify-center items-center text-gray-600">
                    <ul className="list-disc">
                      {row[arr].map((ref) => {
                        return (
                          <li id={ref.id}>
                            {ref.name.split("").map((letter, index) => {
                              return (
                                <span
                                  key={index}
                                  // onClick={() => handleLetterClick(index)}
                                  style={{
                                    backgroundColor: [
                                      ...search.split(""),
                                    ].includes(letter)
                                      ? "#ffaa66"
                                      : "transparent",
                                  }}
                                >
                                  {letter}
                                </span>
                              );
                            })}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <>
                    <div>
                      {
                        "il n'y a pas de références dans cette référence globale"
                      }
                    </div>
                  </>
                )}
              </TableCell>

              <TableCell align="center">{row.alert}</TableCell>

              <TableCell align="center">
                <div className="flex justify-center gap-2 items-center ">
                  <DialogUI
                    text={`Modifier ${main}`}
                    extraFunc={setId}
                    extraData={row.id}
                    button={
                      <>
                        <ResUpdate
                          refetch={refetch}
                          url={main}
                          data={updatedData}
                          id={row.id}
                        />
                      </>
                    }
                    icon={
                      <IconButton>
                        <EditIcon />
                      </IconButton>
                    }
                  >
                    {/* <StandardForm func={getUpdateData} /> */}
                    {/* <RelatedForm
                      position={position}
                      main={main}
                      second={second}
                      index={index}
                      refetch={refetch}
                      initialValue={row.alert}
                      func={setValue}
                      id={id}
                    /> */}
                  </DialogUI>
                  <DialogUI
                    text={"êtes-vous sûr"}
                    icon={
                      <>
                        <IconButton>
                          <Delete />
                        </IconButton>
                      </>
                    }
                    button={
                      <>
                        <ResDelete url={main} id={row.id} refetch={refetch} />
                      </>
                    }
                  >
                    "Cette action supprimera cet élément parement!"
                  </DialogUI>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
        <Pagination func={paginationFunc} max={pages} curr={curr} />
      </MainTable>
    </>
  );
};

export default RefRootBase;
