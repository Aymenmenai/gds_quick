import {
  Add,
  Autorenew,
  Delete,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { Button, IconButton, TableCell } from "@mui/material";
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
import StandardForm from "@/components/core/form/standard-form";
import ResUpdate from "@/components/interface/res/res-update";
import Pagination from "../build/pagination/pagination";
import { plotFieldValues } from "../core/func/plotFieldValues";
import SingleAutoInput from "../interface/single-auto-input";

const BaseStandard = ({
  main,
  extraData = false,
  inputs = [{ name: "Nom", field: "name" }],
}) => {
  const [input, setInput] = useState(extraData || {});
  const [updatedData, setUpdatedData] = useState({});
  const [search, setSearch] = useState(false);

  const [currPage, setCurrPage] = useState(1);

  const { data, isLoading, refetch } = useQuery(
    [main, extraData],
    () => {
      const queryParam = extraData
        ? `${Object.keys(extraData)[0]}=${Object.values(extraData)[0]}`
        : "";
      const mainUrl = `/api/v1/${main}/all?sort=-id&page=${currPage}${
        queryParam ? `&${queryParam}` : ""
      }${search ? `&name=${search}` : ""}`;
      // console.log(mainUrl, extraData, "HELLLLLLLLL");
      return axios.get(mainUrl);
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const searchHanlder = (index, value) => {
    setSearch(value);
  };
  const setValue = (index, value) => {
    setInput((prev) => ({ ...prev, [index]: value.toUpperCase() }));
  };
  const setUpdate = (index, value) => {
    setUpdatedData((prev) => ({ ...prev, [index]: value.toUpperCase() }));
  };

  // PAGINATION
  const paginationFunc = (page) => {
    setCurrPage(page);
  };

  useEffect(() => {
    setCurrPage(1);
  }, [search]);
  useEffect(() => {
    if (extraData) {
      refetch();
      setInput(extraData);
    } else {
      refetch();
    }
  }, [extraData, refetch, currPage, search]);

  // const columns = [
  //   { field: "id", name: "#" },
  //   { field: "name", name: `Nom de ${main}` },
  // ];

  if (isLoading) {
    return <>loading...</>;
  }

  const rows = data?.data?.data?.data || "No data returned";
  const curr = data?.data?.data.currPage;
  const pages = data?.data?.data.pages;

  //console.log("MAIN", input);
  return (
    <>
      <div className="flex gap-2 justify-between items-center py-2">
        <div className="flex-1 flex gap-2 items-center justify-center">
          <Input
            type={"text"}
            label={"Rechercher"}
            func={searchHanlder}
            index={"name"}
          />
        </div>
        <div className="flex gap-2">
          <DialogUI
            text={`Ajouter un ${main}`}
            button={
              <Res
                url={main}
                data={input}
                refetch={refetch}
                text={`Ajouter un ${main}`}
              />
            }
            icon={
              <IconButton>
                <Add />
              </IconButton>
            }
          >
            <div className="flex flex-col gap-2">
              {inputs.map((el) => {
                return (
                  <Input
                    key={inputs.indexOf(el)}
                    type="text"
                    label={el.name}
                    func={setValue}
                    index={el.field}
                  />
                );
              })}
            </div>
          </DialogUI>

          <IconButton onClick={refetch}>
            <Autorenew />
          </IconButton>
        </div>
      </div>
      <MainTable columns={[...inputs]}>
        {Array.isArray(rows) ? (
          rows.map((row) => (
            <TableRow hover tabIndex={-1} key={row.id}>
              {inputs.map((el) => {
                return (
                  <TableCell key={el.id} align="center">
                    {`${
                      el.field.includes(".")
                        ? plotFieldValues(row, el.field) || "/"
                        : row[el.field] || "/"
                    }`}
                  </TableCell>
                );
              })}
              <TableCell align="center">
                <div className="flex justify-center gap-2 items-center ">
                  <DialogUI
                    text={`Fiche d'identité de ${main}`}
                    button={
                      <ResUpdate
                        refetch={refetch}
                        url={main}
                        data={updatedData}
                        id={row.id}
                      />
                    }
                    icon={
                      <IconButton>
                        <Visibility />
                      </IconButton>
                    }
                  >
                    {inputs.map((el) => {
                      return (
                        <>
                          <div
                            key={inputs.indexOf(el)}
                            className="flex justify-between items-center"
                          >
                            <div>{`${el.name} :  ${
                              el.field.includes(".")
                                ? plotFieldValues(row, el.field) || "/"
                                : row[el.field] || "/"
                            }`}</div>
                            <div></div>
                          </div>
                        </>
                      );
                    })}
                  </DialogUI>

                  <DialogUI
                    text={`Modifier ${main}`}
                    button={
                      <ResUpdate
                        refetch={refetch}
                        url={main}
                        data={updatedData}
                        id={row.id}
                      />
                    }
                    icon={
                      <IconButton>
                        <EditIcon />
                      </IconButton>
                    }
                  >
                    <div className="flex flex-col gap-2">
                      {inputs.map((el) => {
                        return (
                          <>
                            {el.field.includes(".") ? (
                              <>
                                {/* <SingleAutoInput
                                  data={[]}
                                  // func={setInputs}
                                  // state={dataInput}
                                  index={el.field.split(".")[0] + "Id"}
                                  label={el.name}
                                /> */}
                              </>
                            ) : (
                              <Input
                                key={inputs.indexOf(el)}
                                type="text"
                                label={el.name}
                                func={setUpdate}
                                index={el.field}
                                initialValue={row[el.field]}
                              />
                            )}
                          </>
                        );
                      })}
                    </div>
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
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={inputs.length} align="center">
              {rows}
            </TableCell>
          </TableRow>
        )}
      </MainTable>
      <Pagination func={paginationFunc} max={pages} curr={curr} />
    </>
  );
};

export default BaseStandard;
