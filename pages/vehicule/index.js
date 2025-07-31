import StandardDialog from "@/components/base/dialog/standard-dialog";
import StandardInput from "@/components/base/input/standard-input";
import StandardOption from "@/components/base/input/standard-option";
import VehiculeForm from "@/components/build/form/vehicule-form";
import Pagination from "@/components/build/pagination/pagination";
import MainTable from "@/components/build/table/main-table";
import MainBtn from "@/components/interface/btn/main-btn";
import ApiService from "@/components/logic/ApiService";
import { removeUndefinedValues } from "@/components/logic/mini-func";
import AdvanceTemplate from "@/components/root/template/advance/advance-template";
import { useStoreApiFeatures } from "@/components/state/useStoreApiFeatures";
import { useStoreFilter } from "@/components/state/useStoreFilter";
import { useStoreVehicule } from "@/components/state/useVehiculeStore";
import { Add } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";

const PaginationContainer = ({ max, curr, func }) => {
  return (
    <div className="absolute bottom-0 w-full py-3 px-4 flex items-center justify-center gap-3 ">
      <Pagination func={func} max={max} curr={curr} />
    </div>
  );
};

const Index = () => {
  // const [option, setOption] = useState(null);
  const { vehicule, fillVehicule } = useStoreVehicule((state) => state);
  // const searchOption = [
  //   { field: "name", name: "le nom de vehicule" },
  //   { field: "VehiculeCodes.name", name: "Code" },
  // ];

  const columns = [
    { field: "name", name: "Nom" },
    { field: "VehiculeClient.name", name: "Client" },
    { field: "VehiculeType.Brand.name", name: "Marque" },
    { field: "VehiculeType.name", name: " Type" },
    { field: "matricule", name: "Matricule" },
    { field: "serialCode", name: " Code de serie" },
  ];
  const inputs = [
    { field: "name", name: "NOM" },
    { field: "matricule", name: "Matricule" },
    { field: "serialCode", name: " Code de serie" },
    // { field: "VehiculeClient.name", name: "Client" },
  ];

  const Api = new ApiService("vehicule", undefined);
  // STATE
  const [search, setSearch] = useState("");
  const [field, setField] = useState("name");
  const [page, setPage] = useState(1);
  const [url, setUrl] = useState(`?page=${page}`);
  const data = useQuery(`vehicules`, () => Api.getMany(url), {
    // refetchInterval:1000,
  });
  const deleteFunc = useMutation((obj) => Api.delete(obj));
  const updateFunc = useMutation((obj) => Api.update(obj));
  const createFunc = useMutation((obj) => Api.create(obj));
  //
  const searchHandler = (field, value) => {
    setSearch(value);
  };

  const edit = (obj) => {
    const { id, ...clean } = removeUndefinedValues(obj);
    updateFunc.mutate([id, { ...clean }]);
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
  // console.log("\\\\\\Hello/////");
  // console.log(apiFeature.clean);
  // console.log(vehicule,"90979wd68wdtq7wtq7");
  return (
    <>
      <div className="pb-3 flex-1 flex gap-2 items-center justify-center">
        <StandardOption
          onChange={(value) => setField(value)}
          option={columns}
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
          title={"Creer une vehicule"}
          btn={
            <>
              <IconButton>
                <Add />
              </IconButton>
            </>
          }
        >
          <VehiculeForm />
          {!!vehicule.VehiculeTypeId && vehicule.serialCode && (
            <div className="py-3">
              <MainBtn func={() => createFunc.mutate(vehicule)}>
                Ajouter
              </MainBtn>
            </div>
          )}
        </StandardDialog>
      </div>
      <div className="w-full  ">
        <MainTable
          // selection={selection}
          option={1}
          root={"vehicule"}
          columns={columns}
          data={data.data?.data?.data?.data}
          // standardEdit={true}
          // onEditClick={onEditClick}
          editFunc={(data) => edit(data)}
          standardEdit={inputs}
          // onDeleteClick={(id) => deleteFunc.mutate(id) }

          // editId={editId}
          // onViewClick={
          //   onViewClick
          //     ? (id) => {
          //         router.push(`${root}/${id}`);
          //       }
          //     : false
          // }
          // //SECONDARY COLUMNS
          fieldName={["VehiculeClient","VehiculeType"]}
          // secondColumns={secondColumns}
          // secondRoot={secondRoot}
          // filterTable={filterTable}
        >
          <PaginationContainer
            func={setPage}
            curr={page}
            max={data.data?.data?.data.pages}
          />
        </MainTable>
      </div>
    </>
  );
};

export default Index;
