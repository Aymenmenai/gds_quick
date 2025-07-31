import StandardInput from "@/components/base/input/standard-input";
import StandardOption from "@/components/base/input/standard-option";
import StandardForm from "@/components/build/form/StandardForm";
import Pagination from "@/components/build/pagination/pagination";
import Panel from "@/components/build/panel/panel";
import MainTable from "@/components/build/table/main-table";
import MainBtn from "@/components/interface/btn/main-btn";
import Responsebar from "@/components/interface/responsebar/responsebar";
import ApiService from "@/components/logic/ApiService";
import { removeUndefinedValues } from "@/components/logic/mini-func";
import { useStoreApiFeatures } from "@/components/state/useStoreApiFeatures";
import { useStoreFilter } from "@/components/state/useStoreFilter";
import { useStoreAQS } from "@/components/state/useStoreSortie";
import { Download, Replay } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";

// TOTAL
const PaginationContainer = ({ max, curr, func }) => {
  return (
    <div className="absolute bottom-0 w-full py-3 px-4 flex items-center justify-center gap-3 ">
      <Pagination func={func} max={max} curr={curr} />
    </div>
  );
};

export default function StandardTemplate({
  children = false,
  columns,
  root,
  searchOption,
  panel = true,
  panelFilter = [],
  panelSlider = [],
  additionFilter = false,
  // FUNCTION
  onEditClick = false,
  onDeleteClick = false,
  onViewClick = false,
  editFunc = false,
  onCreateClick = false,
  standardEdit = false,
  // TABLE
  option = false,
  // FOR ARTICLE
  selection = false,
  sortiebtn = false,
  parentId = false,
  fieldName = false,
  extra = "",
  isExport = false,
  // SORTE NAME CHANGE
  sortieChangingName =false
}) {
  const router = useRouter();
  // GLOAB
  const filter = useStoreFilter((state) => state);
  const apiFeature = useStoreApiFeatures((state) => state);
  const out = useStoreAQS((state) => state.ids.length);

  const Api = new ApiService(root, undefined);
  // STATE
  const [search, setSearch] = useState("");
  const [panelFilterState, setPanelFilterState] = useState("")
  const init_field = !!searchOption ? searchOption[0]?.field ?? columns[0]?.field : ""
  const [field, setField] = useState(init_field);
  const [url, setUrl] = useState(extra);
  const [page, setPage] = useState(1);

  const data = useQuery(`${root}s`, () => Api.getMany(url), {});

  const deleteFunc = useMutation((obj) => Api.delete(obj));
  const updateFunc = useMutation((obj) => Api.update(obj));
  const createFunc = useMutation((obj) => Api.create(obj));

  // RUN INITAIL FUNCTION
  // SEARCHING FUNCTION
  const searchHandler = (field, value) => {
    setSearch(value);
    filter.fillFilter(0, "value", value);
  };

  const edit = (obj) => {
    const { id, ...clean } = removeUndefinedValues(obj);
    updateFunc.mutate([id, { ...clean }]);
  };
  
  // RELATED TO SORTIE ==================================================================
  const updateNameSortie =(id,number)=>{
    // console.log(id,number+0.123456789)
      // updateFunc.mutate([id, { number:+`${number}999`- }]);
  }
  // END RELATED TO SORTIE ==================================================================
  const create = (obj) => {
    let newObj = { ...obj };
    if (parentId) {
      newObj[`${fieldName}Id`] = parentId;
    }
    const clean = removeUndefinedValues(newObj);
    createFunc.mutate({ ...clean });
  };

  // START NEW FILTER
  useEffect(() => {
    filter.emptyFilter();
    filter.initialFilter()

    if (panel) {
      // DATE


      // FILTER
      panelFilter.map((el) => {
        filter.addFilter({ name: `${el.field}`, value: "" });
      });
    }
    panelSlider.map((el) => {
      filter.addFilter({ name: `${el.field}[lte]`, value: "" });
      filter.addFilter({ name: `${el.field}[gte]`, value: "" });
    });
  }, []);

  useEffect(() => {
    data.refetch();
  }, [url, updateFunc.isSuccess, createFunc.isSuccess, deleteFunc.isSuccess]);
  useEffect(() => {
    setSearch(null);
  }, [field]);

  useEffect(() => {
    // console.log(panelFilterState, "what's up ")
    setUrl(`?page=1${field && search ? `&${field}=${search}` : ""}${panelFilterState}`);
  }, [panelFilterState])


  useEffect(() => {
    setUrl(`?page=${page}${field && search ? `&${field}=${search}` : ""}${panelFilterState}`);
  }, [page]);

  useEffect(() => {
    if (search?.length > 0 && field) {
      setPage(1);
      setUrl(`?page=1&${field && search ? `&${field}=${search}` : ""}${panelFilterState}`);
    } else {
      setUrl(`?page=${page}${panelFilterState}`);
    }
  }, [search]);


  // FOR NEW DATA
  if (data.isLoading) {
    return <>Loading</>;
  }

 
  return (
    <>
      {updateFunc.isSuccess || createFunc.isSuccess || deleteFunc.isSuccess ? (
        <Responsebar />
      ) : (
        <></>
      )}

      {updateFunc.isError || createFunc.isError || deleteFunc.isLoading ? (
        <Responsebar isError={true} />
      ) : (
        <></>
      )}
      <div className="flex gap-3 justify-start items-center flex-row-reverse py-3">
        <>
          {panel && (
            <Panel
              panelFilter={panelFilter}
              panelSlider={panelSlider}
              func={setPanelFilterState}
              url={panelFilterState}
              root={root}
              obj={{}}
            />
          )}
          {onCreateClick ? (
            <StandardForm
              condition={data.isRefetching && data.isFetched}
              title={`créer ${root}`}
              btntext={"Créer"}
              inputs={standardEdit}
              updateFunc={create}
              btn={
                <MainBtn func={() => { }}>
                  {`Créez un autre élément de ${root}`}
                </MainBtn>
              }
            />
          ) : (
            <></>
          )}
          <IconButton onClick={data.refetch}>
            <Replay />
          </IconButton>
          {isExport ? (
            <IconButton
              onClick={() =>
                window.open(
                  `/api/v1/${root}/export` + url,
                  "_blank"
                )
              }
            >
              <Download />
            </IconButton>
          ) : (
            <></>
          )}
          {sortiebtn ? (
            <MainBtn
              func={() => router.push("/sortie/create")}
            >{`vous avez sélectionné ${out} articles pour la sortie`}</MainBtn>
          ) : (
            <></>
          )}
          {searchOption ? (
            <div className="flex-1 flex gap-2 items-center justify-center">
              <StandardOption
                onChange={(value) => setField(value)}
                option={searchOption}
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
            </div>
          ) : (
            <></>
          )}
        </>
      </div>
      <div className="w-full  ">
        {data.data?.data?.data?.data.length > 0
          &&
          <MainTable
            extra={children}
            selection={selection}
            option={option}
            root={root}
            columns={columns}
            data={data.data?.data?.data?.data}
            standardEdit={standardEdit}
            onEditClick={onEditClick}
            editFunc={standardEdit ? (data) => edit(data) : editFunc}
// =========================================================================================
          updateNameSortie={updateNameSortie}
          sortieChangingName={sortieChangingName}
// =========================================================================================
            onDeleteClick={onDeleteClick ? (id) => deleteFunc.mutate(id) : false}
            onViewClick={
              onViewClick
                ? (id) => {
                  router.push(`${root}/${id}`);
                }
                : false
            }
          >
            <PaginationContainer
              func={setPage}
              curr={page}
              max={data.data?.data?.data.pages}
            />
          </MainTable>
        }
      </div>
    </>
  );
}
