// import AQSForm from "@/components/build/form/aqs-form";
import SortieForm from "@/components/build/form/sortie-form";
import StandardForm from "@/components/build/form/StandardForm";
import MainTable from "@/components/build/table/main-table";
import MainBtn from "@/components/interface/btn/main-btn";
import SecondaryBtn from "@/components/interface/btn/secondary-btn";
import Loading from "@/components/interface/loading/loading";
import ApiService from "@/components/logic/ApiService";
import {
  compareObjects,
  currencyFormatter,
  removeUndefinedValues,
  renderDate,
} from "@/components/logic/mini-func";
import { useStoreAQS, useStoreSortie } from "@/components/state/useStoreSortie";
import { useStoreAttributes } from "@/components/state/useStoreAttributes";
import { Add, Download, Edit, Person, Print } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import StandardDialog from "@/components/base/dialog/standard-dialog";
import StandardTemplate from "@/components/root/template/standard/standard-template";
import DefaultTemplate from "@/components/v1/templates/default-template";

const TotalPrice = ({ price }) => {
  return (
    <>
      <div className="font-extralight uppercase">{"Le price total: "}</div>
      <div className="text-2xl font-semibold">
        {currencyFormatter.format(price)}
      </div>
    </>
  );
};

const Id = () => {
  // ADD
  const searchOption = [
    { field: "Ref.name", name: "Reference" },
    { field: "name", name: "Designiation" },
    { field: "Entree.Fournisseur.name", name: "Le fournisseur" },
    { field: "Entree.number", name: "Bon d'entree" },
  ];

  const addArticleColumns = [
    { field: "Ref.name", name: "Reference" },
    { field: "name", name: "Designiation" },
    { field: "date", name: "La date" },
    { field: "price", name: "Prix" },
    { field: "quantity", name: "Quantite" },
    { field: "SousFamily.name", name: "Sous Family" },
    { field: "Unit.name", name: "Unite" },
    { field: "Entree.Fournisseur.name", name: "Le fournisseur" },
  ];

  // CAUSUAL
  const columns = [
    { field: "Article.Ref.name", name: "Reference" },
    { field: "Article.name", name: "Designiation" },
    { field: "date", name: "La date" },
    { field: "price", name: "Prix" },
    { field: "quantity", name: "Quantite" },
    { field: "Article.tax", name: "la tax" },
    { field: "Article.SousFamily.name", name: "Sous Family" },
    { field: "Article.Unit.name", name: "Unite" },
  ];

  const router = useRouter();

  if (!router.query.id) {
    return <Loading />;
  }

  let id = router.query.id[0];

  const { emptyAQS, ids, setAQSData } = useStoreAQS((state) => state);
  const { sortie: SortieState, initializeSortie } = useStoreSortie(
    (state) => state
  );

  // const [currId, setCurrId] = useState(undefined);

  const api = new ApiService("sortie", id);
  const aqsApi = new ApiService("articlequisort");
  const Sortie = useQuery("sortie", () => api.getOne());
  const updateSortie = useMutation((arr) => api.update(arr));
  const createAQS = useMutation((obj) => aqsApi.create(obj));
  const deleteAQS = useMutation((id) => aqsApi.delete(id));
  const updateAQS = useMutation((id) => aqsApi.update(id));

  // FUNCTIONS
  const handleOpenNewTab = (url) => {
    const newTab = window.open(url, "_blank");
    newTab.focus();
  };

  const cancelHandler = () => {
    emptyAQS();
  };

  // UPDATE FUNCS
  const updateFunction = (curr) => {
    // setComparingObj(curr);
    // setAQSData(curr);
    // setAttributeData([...curr.Attributes]);
  };
  const edit = (obj) => {
    const { id, ...clean } = removeUndefinedValues(obj);
    // console.log(clean);
    updateAQS.mutate([id, { ...clean }]);
  };

  // UPDATE sortie
  const eUpdate = () => {
    const firstObj = compareObjects(
      { ...Sortie.data?.data?.data },
      { ...SortieState }
    );
    const obj = { ...removeUndefinedValues(firstObj) };
    updateSortie.mutate([Sortie.data?.data?.data?.id, { ...obj }]);
  };
  // // UPDATE ATTRIBUTE
  const addAQS = (id) => {
    let arr = [];
    ids.map((el) => {
      arr.push({ ArticleId: el.id, quantity: 0, SortieId: id });
    });
    createAQS.mutate(arr);
    router.reload();
  };

  // USE EFFECT
  useEffect(() => {
    Sortie.refetch();
    cancelHandler();
  }, [createAQS.isSuccess, deleteAQS.isSuccess]);

  useEffect(() => {
    Sortie.refetch();
  }, [updateAQS.isSuccess, updateSortie.isSuccess]);

  // GLOBAL STATE
  useEffect(() => {
    initializeSortie({ ...Sortie.data?.data?.data });
  }, [Sortie.isSuccess]);
  // LOADING
  if (Sortie.isLoading)
    return (
      <>
        <Loading />
      </>
    );
  const sortie = Sortie.data?.data?.data;

  // console.log(SortieState);
  // console.log(ids);
  // console.log(Sortie);
  // console.log(sortie);
  return (
    <>
      <div className="flex justify-between items-start ">
        <div>
          <div className="text-2xl text-gray-400 uppercase">
            {`Numéro de sortie : ${sortie.number || "/"}`}
          </div>
          <div className="text-sm text-gray-700">{`la date creation de cet sortie : ${renderDate(
            sortie.date
          )}`}</div>
        </div>
        <div className="flex justify-end items-center gap-2 ">
          <StandardDialog
            btn={
              <>
                <IconButton>
                  <Add />
                </IconButton>
              </>
            }
          >
            <DefaultTemplate
              columns={addArticleColumns}
              panel={false}
              root={"article"}
              extra={"quantity[gte]=1"}
            />
            {/* <StandardTemplate
              additionFilter={addArticleColumns}
              selection={true}
              searchOption={searchOption}
              columns={addArticleColumns}
              panel={false}
              root={"article"}
              // RELATED WITH PANEL
              // FUNCTION
              onViewClick={false}
              option={false}
              extra={"quantity[gte]=1"}
            /> */}
            <div className=" w-full flex justify-center items-end pt-2 ">
              <MainBtn func={() => addAQS(sortie.id)}>
                {"Ajouter pour cette sortie"}
              </MainBtn>
            </div>
          </StandardDialog>

          {/* EDIT */}
          <StandardForm
            title={"modifier la sortie"}
            updateFunc={eUpdate}
            btn={
              <IconButton>
                <Edit />
              </IconButton>
            }
          >
            <SortieForm data={sortie} isNumber={true} />
          </StandardForm>

          <IconButton
            onClick={() => window.open(`/api/v1/sortie/export/${id}`, "_blank")}
          >
            <Download />
          </IconButton>
          <IconButton
            onClick={() => {
              handleOpenNewTab(`/sortie/pdf/${id}`);
            }}
            size="small"
          >
            <Print />
          </IconButton>
        </div>
      </div>
      <div className="bg-red-800/0 w-full py-4">
        <div className="flex gap-2 items-center h-7">
          <div>{`Nom du beneficiare : ${sortie.Beneficiare?.name || "/"}`}</div>
        </div>

        {sortie.Vehicule ? (
          <div className="flex gap-2 items-center h-7">
            <div>{`Engin :  ${sortie?.Vehicule?.name || ""} (${
              sortie?.Vehicule?.matricule || "/"
            }) `}</div>
          </div>
        ) : (
          <></>
        )}
      </div>
      {/* TABLES */}
      <div className="w-full h-[70vh] ">
        <MainTable
          columns={columns}
          data={sortie.ArticleQuiSorts}
          editFunc={edit}
          onDeleteClick={deleteAQS.mutate}
          standardEdit={[
            { name: "Quantity", field: "quantity", type: "number" },
          ]}
          option={true}
        >
          <TotalPrice price={sortie.total_price} />
        </MainTable>
      </div>
    </>
  );
};

export default Id;
