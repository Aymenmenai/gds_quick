import StandardDialog from "@/components/base/dialog/standard-dialog";
import StandardInput from "@/components/base/input/standard-input";
import StandardOption from "@/components/base/input/standard-option";
import Pagination from "@/components/build/pagination/pagination";
import BaseTable from "@/components/build/table/base-table";
import GenerateRow from "@/components/build/table/generate-row";
import MainBtn from "@/components/interface/btn/main-btn";
import ApiService from "@/components/logic/ApiService";
import { useStoreApiFeatures } from "@/components/state/useStoreApiFeatures";
import { useStoreFilter } from "@/components/state/useStoreFilter";
import { useStoreSousFamily } from "@/components/state/useStoreSousFamily";
import { Add, Class, Edit } from "@mui/icons-material";
import { IconButton, TableCell, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";

const SousFamilySeach = ({
  func, // sousFamilyetching function
  id,
}) => {
  const [name, setName] = useState(null);
  const [url, setUrl] = useState(null);
  const Api = new ApiService("sousFamily", undefined);
  const data = useQuery(`allsousFamilys`, () => Api.getMany(url));
  const updateFunc = useMutation((data) => Api.update([data[0], data[1]]));
  const addFunc = useMutation((data) => Api.create(data));

  useEffect(() => {
    if (name) {
      setUrl(`?name=${name}`);
    }
  }, [name]);
  useEffect(() => {
    data.refetch();
    func();
  }, [url, updateFunc.isSuccess,addFunc.isSuccess]);


  if (data.isLoading) {
    return <>loading</>;
  }
  const main = data.data?.data?.data?.data;

  // console.log(main)
  return (
    <div className="w-1/2">
      <StandardInput
        field={"name"}
        title={"rechearcher des family"}
        placeholder={"enter une family"}
        type={"text"}
        value={name}
        onChange={(name, value) => {
          setName(value);
        }}
      />
      <div className="h-[30svh] divide-y overflow-y-scroll w-full">
        {main.length ? main.map((el, index) => {
          return (
            <div
              key={index}
              className=" py-2 px-1 flex justify-between items-center"
            >
              <div>{el.name}</div>
              {el.FamilyId === id ? (
                <button
                  onClick={() =>
                    updateFunc.mutate([el.id, { FamilyId: null }])
                  }
                  className={`${"bg-red-500 text-white cursor-pointer "} text-xs font-bold py-1 px-2 rounded-md  `}
                >
                  Supprimer
                </button>
              ) : (
                <div className="flex justify-end items-center gap-2">
                  {!el.FamilyId && (
                    <div className="text-xs bg-yellow-500 text-yellow-800 p-1 rounded-full flex justify-center items-center text-center">
                      {"cette family a ete aucun family globelle"}
                    </div>
                  )}
                  <button
                    onClick={() =>
                      updateFunc.mutate([el.id, { FamilyId: id }])
                    }
                    className={`${"bg-blue-600 text-white cursor-pointer"} text-xs font-bold py-1 px-2 rounded-md  `}
                  >
                    Ajouter
                  </button>
                </div>
              )}
            </div>
          );
        }) :
          <div

            className=" py-2 px-1 flex justify-between items-center"
          >

            <div>{name}</div>
            <button
              onClick={() =>
                addFunc.mutate({ name: name, FamilyId: id })
              }
              className={`${"bg-red-500 text-white cursor-pointer "} text-xs font-bold py-1 px-2 rounded-md  `}
            >
              {"Ajouter"}
            </button>


          </div>
        }
      </div>
    </div>
  );
};

const PaginationContainer = ({ max, curr, func }) => {
  return (
    <div className="absolute bottom-0 w-full py-3 px-4 flex items-center justify-center gap-3 ">
      <Pagination func={func} max={max} curr={curr} />
    </div>
  );
};

const Index = () => {
  const { sousFamily, fillSousFamily, initializeSousFamily } = useStoreSousFamily((state) => state);

  const columns = [
    { field: "name", name: "Famillie " },
    { field: "SousFamilies", name: "Sous-Famillie" },
  ];
  const inputs = [
    { field: "name", title: "", type: "text" },

  ];
  const normalInput = [
    { field: "name", title: "Name", type: "text" },
  ];

  const filter = useStoreFilter((state) => state);
  const apiFeature = useStoreApiFeatures((state) => state);

  const Api = new ApiService("family", undefined);

  // STATE
  const [search, setSearch] = useState("");
  const [field, setField] = useState("name");
  const [page, setPage] = useState(1);
  const [url, setUrl] = useState(`?page=${page}`);

  const data = useQuery(`sousFamilys`, () => Api.getMany(url), {
    // sousFamilyetchInterval:1000,
  });
  const deleteFunc = useMutation((obj) => Api.delete(obj));
  const updateFunc = useMutation((obj) => Api.update([obj.id, obj]));
  const createFunc = useMutation((obj) => Api.create(obj));
  // SEARCHING
  const searchHandler = (field, value) => {
    setSearch(value);
    // console.log(field, value, globalUrl, "hhhhhhhudsyhuisd")
  };

  useEffect(() => {
    data.refetch();
  }, [url, updateFunc.isSuccess, createFunc.isSuccess, deleteFunc.isSuccess]);
  useEffect(() => {
    setSearch(null);
  }, [field]);

  useEffect(() => {
    // if (search?.length > 0 && field) {
    // setPage(1);
    setUrl(`?page=${page}${field && search ? `&${field}=${search}` : ""}`);
    // }
  }, [page]);

  useEffect(() => {
    if (search?.length > 0 && field) {
      setPage(1);
      setUrl(`?page=1&${field && search ? `&${field}=${search}` : ""}`);
    } else {
      setUrl(`?page=${page}`);
    }
  }, [search]);

  if (data.isLoading) {
    return <>Loading</>;
  }


  const family = data.data?.data?.data?.data || false;
  return (
    <>
      <div className="pb-3 flex-1 flex gap-2 items-center justify-center">
        <StandardOption
          onChange={(value) => setField(value)}
          option={[{ field: "name", name: "Famillie " },
            // { field: "SousFamily.name", name: "Sous-Famillie" },
          ]}
        />
        <StandardInput
          type="text"
          title={"Rechercher"}
          placeholder={"Rechercher"}
          onChange={searchHandler}
          field={"number"}
          defaultValue={""}
          value={search}
        />

        <StandardDialog
          title={"Creer une sousFamily"}
          btn={
            <>
              <IconButton>
                <Add />
              </IconButton>
            </>
          }
        >
          {inputs.map((el, index) => {
            return (
              <StandardInput
                key={index}
                title={el.title}
                field={el.field}
                type={el.type}
                value={sousFamily[el.field] || el.default}
                onChange={fillSousFamily}
              />
            );
          })}
          <div className="py-3">
            <MainBtn func={() => createFunc.mutate(sousFamily)}>Ajouter</MainBtn>
          </div>
        </StandardDialog>
      </div>
      <div className="w-full  ">

        <>
          <BaseTable option={true} columns={columns}>
            {family ? (
              <>
                {family.map((el, index) => {
                  return (
                    <GenerateRow
                      // selection={false}
                      key={el.id}
                      index={index + 1}
                      data={el}
                      columns={columns}
                    > {true && (
                      <>

                      </>
                    )}

                      <StandardDialog
                        state={updateFunc.isSuccess}
                        btn={
                          <IconButton
                            onClick={() => {
                              initializeSousFamily({ id: el.id });
                            }}
                          >
                            <Class sx={{ width: 20, height: 20 }} />
                          </IconButton>
                        }
                      >
                        <div className="w-[50svw] flex flex-col gap-3">
                          {normalInput.map((e, index) => {
                            return (
                              <StandardInput
                                key={index}
                                title={e.title}
                                field={e.field}
                                type={e.type}
                                value={sousFamily[e.field] || el[e.field]}
                                onChange={fillSousFamily}
                              />
                            );
                          })}
                          <div className="py-3 flex justify-between items-center">
                            <MainBtn func={() => updateFunc.mutate(sousFamily)}>
                              {
                                "Modifier les valuers de la family globelle"
                              }
                            </MainBtn>
                            <StandardDialog
                              title={`Les family compatible for ${el.name}`}
                              state={updateFunc.isSuccess}
                              btn={
                                <IconButton

                                >
                                  <Add />
                                </IconButton>
                              }
                            >
                              <div className="w-[60svw] flex justify-between items-start gap-4">
                                <div>
                                  {el.SousFamilies.map((l, i) => {
                                    return <div key={i}>{l.name}</div>;
                                  })}
                                </div>
                                <SousFamilySeach
                                  id={el.id}
                                  func={() => data.refetch()}
                                />
                              </div>
                            </StandardDialog>
                          </div>

                          <BaseTable
                            columns={[
                              { field: "name", name: "Family" },
                            ]}
                          >
                            {el.SousFamilies.map((e, id) => {
                              return (
                                <GenerateRow
                                  // selection={selection}
                                  key={id}
                                  index={id + 1}
                                  data={e}
                                  columns={[
                                    { field: "name", name: "Family" },
                                  ]}
                                >
                                  <></>
                                </GenerateRow>
                              );
                            })}
                          </BaseTable>
                        </div>
                      </StandardDialog>


                    </GenerateRow>

                  );
                })}
              </>
            ) : (
              <TableRow>
                <TableCell className=" h-[60vh] " colSpan={columns.length + 2}>
                  <div className=" w-full h-full flex justify-center items-center ">
                    {
                      "Aucun article n'est présent sur la table, celle-ci est complètement vide."
                    }
                  </div>
                </TableCell>
              </TableRow>
            )}
            <PaginationContainer
              func={apiFeature.setPage}
              curr={apiFeature.page}
              max={data.data?.data?.data.pages}
            />
          </BaseTable>
        </>
      </div>

    </>
  );
};

export default Index;
