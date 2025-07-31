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
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";

const PaginationContainer = ({ max, curr, func }) => {
  return (
    <div className="absolute bottom-0 w-full py-3 px-4 flex items-center justify-center gap-3">
      <Pagination func={func} max={max} curr={curr} />
    </div>
  );
};

export default function AdvanceTemplate({
  initialInput = {},
  secondColumns = false,
  secondRoot = false,
  columns,
  root,
  searchOption,
  panel = true,
  panelFilter = [],
  panelSlider = [],
  additionFilter = false,
  onEditClick = false,
  onDeleteClick = false,
  onViewClick = false,
  onCreateClick = false,
  standardEdit = false,
  option = false,
  selection = false,
  sortiebtn = false,
  fieldName = false,
  editId = false,
  filterTable = false,
}) {
  const router = useRouter();
  const filter = useStoreFilter((state) => state);
  const apiFeature = useStoreApiFeatures((state) => state);
  const out = useStoreAQS((state) => state.ids.length);

  const Api = new ApiService(root);
  const [search, setSearch] = useState("");
  const init_field = !!searchOption
    ? searchOption[0]?.field ?? columns[0]?.field
    : "";
  const [field, setField] = useState(init_field);
  const [url, setUrl] = useState("");
  const [page, setPage] = useState(1);
  const [panelFilterState, setPanelFilterState] = useState("");

  const { data, refetch, isLoading } = useQuery(
    `${root}s`,
    () => Api.getMany(url),
    {}
  );

  const deleteFunc = useMutation((obj) => Api.delete(obj));
  const updateFunc = useMutation((obj) => Api.update(obj));
  const createFunc = useMutation((obj) => Api.create(obj));

  const searchHandler = (field, value) => {
    setSearch(value);
    filter.fillFilter(0, "value", value);
  };

  const edit = (obj) => {
    const { id, ...clean } = removeUndefinedValues(obj);
    updateFunc.mutate([id, { ...clean }]);
  };

  const create = (obj) => {
    let newObj = { ...obj };
    const clean = removeUndefinedValues(newObj);
    createFunc.mutate({ ...clean });
  };

  useEffect(() => {
    refetch();
  }, [url, updateFunc.isSuccess, createFunc.isSuccess, deleteFunc.isSuccess]);
  useEffect(() => {
    setSearch(null);
  }, [field]);

  useEffect(() => {
    //console.log(panelFilterState, "what's up ")

    setUrl(
      `?page=1${
        field && search ? `&${field}=${search}` : ""
      }${panelFilterState}`
    );
  }, [panelFilterState]);

  useEffect(() => {
    setUrl(
      `?page=${page}${
        field && search ? `&${field}=${search}` : ""
      }${panelFilterState}`
    );
  }, [page]);

  useEffect(() => {
    if (search?.length > 0 && field) {
      setPage(1);
      setUrl(
        `?page=1&${
          field && search ? `&${field}=${search}` : ""
        }${panelFilterState}`
      );
    } else {
      setUrl(`?page=${page}${panelFilterState}`);
    }
  }, [search]);

  if (isLoading) return <>Loading...</>;

  // console.log(data)
  return (
    <>
      {(updateFunc.isSuccess ||
        createFunc.isSuccess ||
        deleteFunc.isSuccess) && <Responsebar />}
      {(updateFunc.isError || createFunc.isError || deleteFunc.isError) && (
        <Responsebar isError />
      )}

      <div className="flex gap-3 justify-start items-center flex-row-reverse py-3">
        {panel && (
          <Panel
            panelFilter={panelFilter}
            panelSlider={panelSlider}
            func={setPanelFilterState}
            root={root}
            obj={{}}
          />
        )}

        {onCreateClick && (
          <StandardForm
            condition={createFunc.isSuccess && data.isRefetching}
            initalInput={initialInput}
            title={`Créer ${root}`}
            btntext={"Créer"}
            inputs={standardEdit}
            updateFunc={create}
            fieldName={fieldName}
            btn={<MainBtn func={() => {}}>{`Créer ${root}`}</MainBtn>}
          />
        )}

        {sortiebtn && (
          <MainBtn func={() => router.push("/sortie/create")}>
            {`Vous avez sélectionné ${out} articles pour la sortie`}
          </MainBtn>
        )}

        {searchOption && (
          <div className="flex-1 flex gap-2 items-center justify-center">
            <StandardOption
              onChange={(value) => setField(value)}
              option={searchOption}
            />
            <StandardInput
              type="text"
              title="Rechercher"
              placeholder="Rechercher"
              onChange={searchHandler}
              field="number"
              value={search}
            />
          </div>
        )}
      </div>

      <div className="w-full">
        <MainTable
          selection={selection}
          option={option}
          root={root}
          columns={columns}
          data={data?.data?.data?.data}
          standardEdit={standardEdit}
          onEditClick={onEditClick}
          editFunc={standardEdit ? edit : undefined}
          onDeleteClick={
            onDeleteClick ? (id) => deleteFunc.mutate(id) : undefined
          }
          editId={editId}
          onViewClick={
            onViewClick ? (id) => router.push(`${root}/${id}`) : undefined
          }
          fieldName={fieldName}
          secondColumns={secondColumns}
          secondRoot={secondRoot}
          filterTable={filterTable}
        >
          <PaginationContainer
            func={setPage}
            curr={page}
            max={data?.data?.data.pages}
          />
        </MainTable>
      </div>
    </>
  );
}
