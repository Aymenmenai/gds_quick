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
import { useStoreRef } from "@/components/state/useStoreRef";
import { Add, Class, Edit } from "@mui/icons-material";
import { IconButton, TableCell, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";

const RefSeach = ({
  func, // refetching function
  id,
}) => {
  const [name, setName] = useState(null);
  const [url, setUrl] = useState(null);
  const Api = new ApiService("ref", undefined);
  const data = useQuery(`allrefs`, () => Api.getMany(url));
  const updateFunc = useMutation((data) => Api.update([data[0], data[1]]));
  const addFunc = useMutation((data) => Api.create(data));



  useEffect(() => {
    if (name) {
      setUrl(`?name=${name}`);
    }
  }, [name]);

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

  return (
    <div className="w-1/2">
      <StandardInput
        field={"name"}
        title={"rechearcher des reference"}
        placeholder={"enter une reference"}
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
              {el.ReferenceId === id ? (
                <button
                  onClick={() =>
                    updateFunc.mutate([el.id, { ReferenceId: null }])
                  }
                  className={`${"bg-red-500 text-white cursor-pointer "} text-xs font-bold py-1 px-2 rounded-md  `}
                >
                  Supprimer
                </button>
              ) : (
                <div className="flex justify-end items-center gap-2">
                  {!el.ReferenceId && (
                    <div className="text-xs bg-yellow-500 text-yellow-800 p-1 rounded-full flex justify-center items-center text-center">
                      {"cette reference a ete aucun reference globelle"}
                    </div>
                  )}
                  <button
                    onClick={() =>
                      updateFunc.mutate([el.id, { ReferenceId: id }])
                    }
                    className={`${"bg-blue-600 text-white cursor-pointer"} text-xs font-bold py-1 px-2 rounded-md  `}
                  >
                    Ajouter
                  </button>
                </div>
              )}
            </div>
          );
        }):
         <div

            className=" py-2 px-1 flex justify-between items-center"
          >

            <div>{name}</div>
            <button
              onClick={() =>
                addFunc.mutate({ name: name, ReferenceId: id })
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
  const { ref, fillRef, initializeRef } = useStoreRef((state) => state);

  const columns = [
    { field: "name", name: "Reference Global" },
    { field: "alert", name: "stock-min" },
    { field: "Refs", name: "References Compatible" },
  ];
  const inputs = [
    { field: "refName", title: "Name", type: "text" },
    { field: "refAlert", title: "Alert", type: "number" },
  ];
  const normalInput = [
    { field: "name", title: "Name", type: "text" },
    { field: "alert", title: "Alert", type: "number" },
  ];

  const filter = useStoreFilter((state) => state);
  const apiFeature = useStoreApiFeatures((state) => state);

  const Api = new ApiService("reference", undefined);

  // STATE
  const [search, setSearch] = useState("");
  // const init_field = !!searchOption ? searchOption[0]?.field ?? columns[0]?.field : ""
  const [field, setField] = useState("name");
  const [url, setUrl] = useState();
  const [page, setPage] = useState(1);


  const data = useQuery(`refs`, () => Api.getMany(url), {
    // refetchInterval:1000,
  });
  const deleteFunc = useMutation((obj) => Api.delete(obj));
  const updateFunc = useMutation((obj) => Api.update([obj.id, obj]));
  const createFunc = useMutation((obj) => Api.create(obj));
  // SEARCHING
  const searchHandler = (field, value) => {
    setSearch(value);
  };

  // INITILIZE FILTER
  useEffect(() => {
    filter.emptyFilter();
    filter.initialFilter()
  }, []);

  // SMALL FILTER
  useEffect(() => {
    apiFeature.addFilter(filter.filters);
    apiFeature.setPage(1);
  }, [filter.filters]);

  // SET NEW URL
  // useEffect(() => {
  //   const newUrl = `${apiFeature.clean +
  //     `${url && url.length > 0
  //       ? apiFeature.clean.length > 0
  //         ? `&${url}`
  //         : `?${url}`
  //       : ""
  //     }`
  //     }`;

  //   // console.log(newUrl);
  //   setGlobalUrl(newUrl);
  // }, [apiFeature.clean]);
  // REFERECHING WITH EVERY UPDATE
  useEffect(() => {
    data.refetch();
  }, [url, updateFunc.isSuccess, createFunc.isSuccess, deleteFunc.isSuccess]);
  useEffect(() => {
    setSearch(null);
  }, [field]);


  useEffect(() => {
    setUrl(`?page=${page}${field && search ? `&${field}=${search}` : ""}`);
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


  const reference = data.data?.data?.data?.data || false;
  // console.log(ref);
  // console.log(apiFeature.clean);
  // console.log(url);
  return (
    <>
      <div className="pb-3 flex-1 flex gap-2 items-center justify-center">
        <StandardOption
          onChange={(value) => setField(value)}
          option={[{ field: "name", name: "Reference Global", }, { field: "Refs.name", name: "Reference" }]}
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
          title={"Creer une ref"}
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
                value={ref[el.field] || el.default}
                onChange={fillRef}
              />
            );
          })}
          <div className="py-3">
            <MainBtn func={() => createFunc.mutate(ref)}>Ajouter</MainBtn>
          </div>
        </StandardDialog>
      </div>
      <div className="w-full  ">

        <>
          <BaseTable option={true} columns={columns}>
            {reference ? (
              <>
                {reference.map((el, index) => {
                  return (
                    <>
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
                                initializeRef({ id: el.id });
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
                                  value={ref[e.field] || el[e.field]}
                                  onChange={fillRef}
                                />
                              );
                            })}
                            <div className="py-3 flex justify-between items-center">
                              <MainBtn func={() => updateFunc.mutate(ref)}>
                                {
                                  "Modifier les valuers de la reference globelle"
                                }
                              </MainBtn>
                              <StandardDialog
                                title={`Les reference compatible for ${el.name}`}
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
                                    {el.Refs.map((l, i) => {
                                      return <div key={i}>{l.name}</div>;
                                    })}
                                  </div>
                                  <RefSeach
                                    id={el.id}
                                    func={() => data.refetch()}
                                  />
                                </div>
                              </StandardDialog>
                            </div>

                            <BaseTable
                              columns={[
                                { field: "name", name: "Reference" },
                              ]}
                            >
                              {el.Refs.map((e, id) => {
                                return (
                                  <GenerateRow
                                    // selection={selection}
                                    key={id}
                                    index={id + 1}
                                    data={e}
                                    columns={[
                                      { field: "name", name: "Reference" },
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
                    </>
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
              func={setPage}
              curr={page}
              max={data.data?.data?.data.pages}
            />
          </BaseTable>
        </>
      </div>

    </>
  );
};

export default Index;
