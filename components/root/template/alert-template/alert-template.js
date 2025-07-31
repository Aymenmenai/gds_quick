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
import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";

const PaginationContainer = ({ max, curr, func }) => {
  return (
    <div className="absolute bottom-0 w-full py-3 px-4 flex items-center justify-center gap-3 ">
      <Pagination func={func} max={max} curr={curr} />
    </div>
  );
};

export default function AlertTemplate({
  children,
  columns,
  root,
  secondRoot,
  searchOption,
  panel = true,
  panelFilter = [],
  panelSlider = [],
  additionFilter = false,
  // FUNCTION
  onEditClick = false,
  onDeleteClick = false,
  onViewClick = false,
  onCreateClick = false,
  standardEdit = false,
  // TABLE
  option = false,
  // FOR ARTICLE
  selection = false,
  sortiebtn = false,
}) {
  const router = useRouter();
  // GLOAB
  const filter = useStoreFilter((state) => state);
  const apiFeature = useStoreApiFeatures((state) => state);
  const out = useStoreAQS((state) => state.ids.length);

  const Api = new ApiService(root, undefined);
  const secondApi = new ApiService(secondRoot, undefined);
  // STATE
  const [search, setSearch] = useState("");
  const data = useQuery(`${root}s group`, () => Api.group(apiFeature.clean), {
    // refetchInterval:1000,
  });
  const deleteFunc = useMutation((obj) => secondApi.delete(obj));
  const updateFunc = useMutation((obj) => secondApi.update(obj));
  const createFunc = useMutation((obj) => secondApi.create(obj));

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

  // START NEW FILTER
  useEffect(() => {
    filter.initialFilter({
      name: additionFilter.name,
      value: additionFilter.value,
    }); // this one to clean and to renew
  }, []);

  useEffect(() => {
    apiFeature.addFilter(filter.filters);
    apiFeature.setPage(1);
  }, [filter.filters]);

  useEffect(() => {
    data.refetch();
  }, [apiFeature.clean, updateFunc.isSuccess, createFunc.isSuccess]);
  // FOR NEW DATA
  if (data.isLoading) {
    return <>Loading</>;
  }
  // console.log(data?.data?.data?.data);

  return (
    <>
      {updateFunc.isSuccess ? <Responsebar /> : <></>}

      {updateFunc.isError || createFunc.isError ? (
        <Responsebar isError={true} />
      ) : (
        <></>
      )}
      <div className="flex gap-3 justify-start items-center flex-row-reverse py-3">
        <>
          {panel ? (
            <Panel
              panelFilter={panelFilter}
              panelSlider={panelSlider}
              func={() => {}}
              root={"entree"}
              obj={{}}
            />
          ) : (
            <></>
          )}
          {onCreateClick ? (
            <StandardForm
              title={`créer ${root}`}
              btntext={"Créer"}
              inputs={standardEdit}
              updateFunc={create}
              btn={
                <MainBtn func={() => {}}>
                  {`Créez un autre élément de ${root}`}
                </MainBtn>
              }
            />
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
                onChange={(value) => filter.fillFilter(0, "name", value)}
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
        <MainTable
          extra={children}
          selection={selection}
          option={option}
          root={root}
          columns={columns}
          data={data.data?.data?.data?.articles}
          standardEdit={standardEdit}
          onEditClick={onEditClick}
          editFunc={standardEdit ? (data) => edit(data) : false}
          onViewClick={
            onViewClick
              ? (id) => {
                  router.push(`${root}/${id}`);
                }
              : false
          }
        >
          <PaginationContainer
            func={apiFeature.setPage}
            curr={apiFeature.page}
            max={data.data?.data?.data.pages}
          />
        </MainTable>
      </div>
    </>
  );
}
