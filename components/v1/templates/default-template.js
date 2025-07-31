//
import VehiculeForm from "@/components/build/form/vehicule-form";
import { useStoreVehicule } from "@/components/state/useVehiculeStore";
//
import ApiService from "@/components/logic/ApiService";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import StandardOption from "@/components/base/input/standard-option";
import StandardInput from "@/components/base/input/standard-input";
import StandardDialog from "@/components/base/dialog/standard-dialog";
import { IconButton } from "@mui/material";
import { Add } from "@mui/icons-material";
import MainBtn from "@/components/interface/btn/main-btn";
import Pagination from "@/components/build/pagination/pagination";
import MainTable from "@/components/build/table/main-table";

const PaginationContainer = ({ max, curr, func }) => {
  return (
    <div className="absolute bottom-0 w-full py-3 px-4 flex items-center justify-center gap-3 ">
      <Pagination func={func} max={max} curr={curr} />
    </div>
  );
};

const DefaultTemplate = ({
  root = "vehicule",
  selection = true,
  columns,
  input,
}) => {
  const { vehicule, fillVehicule } = useStoreVehicule((state) => state);

  //   const columns = [
  //     { field: "VehiculeType.Brand.name", name: "Marque" },
  //     { field: "VehiculeType.name", name: " Type" },
  //     { field: "name", name: "Designiation" },
  //     { field: "matricule", name: "Matricule" },
  //     { field: "serialCode", name: " Code de serie" },
  //   ];
  //   const inputs = [
  //     { field: "name", name: "le nom de vehicule" },
  //     { field: "matricule", name: "Matricule" },
  //     { field: "serialCode", name: " Code de serie" },
  //   ];

  const Api = new ApiService(root, undefined);
  // STATE
  const [search, setSearch] = useState("");
  const [field, setField] = useState(columns[0].field);
  const [page, setPage] = useState(1);
  const [url, setUrl] = useState(`?page=${page}`);
  const data = useQuery(`${root}s`, () => Api.getMany(url), {
    // refetchInterval:1000,
  });

  //
  const searchHandler = (field, value) => {
    // console.log(value, field);
    setSearch(value);
    // filter.fillFilter(0, 'value', value);
  };

  // useEffect(() => {
  //   apiFeature.addFilter(filter.filters);
  //   apiFeature.setPage(1);
  // }, [filter.filters]);

  useEffect(() => {
    data.refetch();
  }, [url]);
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
  //console.log(url);
  //   console.log(data.data?.data?.data?.data);
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
        {/* <StandardDialog
          title={"Creer une vehicule"}
          btn={
            <>
              <IconButton>
                <Add />
              </IconButton>
            </>
          }
        >
          {/* <VehiculeForm /> *
          {!!vehicule.VehiculeType && vehicule.serialCode && (
            <div className="py-3">
              <MainBtn func={() => createFunc.mutate(vehicule)}>
                Ajouter
              </MainBtn>
            </div>
          )}
        </StandardDialog> */}
      </div>
      <div className="w-full  ">
        <MainTable
          selection={selection}
          option={1}
          root={root}
          columns={columns}
          data={data.data?.data?.data?.data}
          // standardEdit={true}
          // onEditClick={onEditClick}
          //   standardEdit={inputs}
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
          //   fieldName={"VehiculeType"}
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

export default DefaultTemplate;
