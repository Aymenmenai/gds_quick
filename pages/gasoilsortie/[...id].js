import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { Add, Edit, Print } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import SortieGasoilForm from "@/components/build/form/sortie-gasoil-form";
import StandardForm from "@/components/build/form/StandardForm";
import MainTable from "@/components/build/table/main-table";
import Loading from "@/components/interface/loading/loading";
import ApiService from "@/components/logic/ApiService";
import {
  currencyFormatter,
  formatDate,
  removeUndefinedValues,
  renderDate,
} from "@/components/logic/mini-func";
import { useStoresortieGasoil } from "@/components/state/useStoreGasoil";

// Total Price Display Component
const TotalPrice = ({ price }) => (
  <>
    <div className="font-extralight uppercase">Le prix total:</div>
    <div className="text-2xl font-semibold">
      {currencyFormatter.format(price)}
    </div>
  </>
);

const Id = () => {
  const router = useRouter();
  const { sortieGasoil } = useStoresortieGasoil((state) => state);

  const id = router.query.id?.[0];
  const [curr, setCurr] = useState(null);

  const api = new ApiService("gasoilsortie", id);
  const apiEl = new ApiService("gasoilelement");

  // API Queries and Mutations
  const Gasoil = useQuery("gasoilsortie", () => api.getOne(), {
    enabled: !!id, // Fetch only when ID exists
  });

  const updateGasoil = useMutation((obj) => api.update(obj));
  const createEl = useMutation((obj) => apiEl.create(obj));
  const deleteEl = useMutation((i) => apiEl.delete(i));
  const updateEl = useMutation((obj) => apiEl.update(obj));

  useEffect(() => {
    setCurr(Gasoil.data?.data?.data);
  }, [Gasoil.data?.data?.data]);

  useEffect(() => {
    if (deleteEl.isSuccess || updateEl.isSuccess || createEl.isSuccess || updateGasoil.isSuccess) {
      Gasoil.refetch();
    }
  }, [deleteEl.isSuccess, updateEl.isSuccess, createEl.isSuccess,updateGasoil.isSuccess]);



  if (Gasoil.isLoading || !id) {
    return <Loading />;
  }

  const gasoil = Gasoil.data?.data?.data;

  // Helper Functions
  const handleOpenNewTab = (url) => {
    const newTab = window.open(url, "_blank");
    newTab?.focus();
  };

  const handleCreateElement = (data) => {
    createEl.mutate({ ...data, GasoilSortieId: id });
  };

  const handleDeleteElement = (elementId) => {
    deleteEl.mutate(elementId);
  };

  const handleEditElement = (obj) => {
    const { id: ElId, ...cleanedData } = removeUndefinedValues(obj);
    updateEl.mutate([ElId, { ...cleanedData, GasoilSortieId: id }]);
  };

  const elementInput = [
    { name: "Quantity", field: "quantity", type: "number" },
    { name: "Prix", field: "price", type: "number" },
    { name: "Date", field: "date", type: "date" },
  ];

  // const initialInput = {
       

  //   date: "",
  //   Vehicule: { matricule: "", value: "" },
  // };

  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <div className="text-2xl text-gray-400 uppercase">
            {`Numéro de bon de sortie: ${gasoil?.number || "/"}`}
          </div>
          <div className="text-sm text-gray-700">
            {`Date de création: ${renderDate(gasoil?.date)}`}
          </div>
          <div className="text-sm text-gray-700">
            {`Bénéficiaire: ${gasoil?.Beneficiare?.name || "-"}`}
          </div>
        </div>
        <div className="flex justify-end items-center gap-2">
          {/* Add New Element */}
          <StandardForm
            add={false}
            optionKey="matricule"
            initalInput={{ price: 23.8981,date:Date.now()}}
            condition={updateEl.isSuccess || createEl.isSuccess}
            title="Créer élément"
            btnText="Créer"
            inputs={elementInput}
            updateFunc={handleCreateElement}
            vehicule
            btn={
              <IconButton>
                <Add />
              </IconButton>
            }
          />

          {/* Edit Gasoline Entry */}
          <StandardForm
            title="Modifier"
            updateFunc={() => updateGasoil.mutate([gasoil.id, sortieGasoil])}
            btn={
              <IconButton>
                <Edit />
              </IconButton>
            }
          >
            <SortieGasoilForm
              modify_number 
              onChange={setCurr}
              beneficiare={() => { }}
              state={{ ...gasoil, Beneficiare: gasoil?.Beneficiare }}
            />
          </StandardForm>

          {/* Print */}
          <IconButton
            onClick={() => handleOpenNewTab(`/gasoilsortie/pdf/${id}`)}
            size="small"
          >
            <Print />
          </IconButton>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="w-full h-[70vh]">
        <MainTable
          columns={[
            { name: "Engin", field: "Vehicule.name" },
            { name: "Matricule", field: "Vehicule.matricule" },
            { name: "Client", field: "Vehicule.VehiculeClient.name" },
            { name: "Date", field: "date" },
            { name: "Qte", field: "quantity" },
            { name: "Prix", field: "price" },
          ]}
          data={gasoil?.GasoilElements || []}
          editFunc={handleEditElement}
          onDeleteClick={handleDeleteElement}
          // fieldName="Vehicule"
          is_vehicule={true}
          standardEdit={[
            { name: "Quantity", field: "quantity", type: "number" },
            { name: "Prix", field: "price", type: "number" },
            { name: "Date", field: "date", type: "date" },
          ]}
          option={true}
        >
          <TotalPrice price={gasoil?.total_price || 0} />
        </MainTable>
      </div>
    </>
  );
};

export default Id;
