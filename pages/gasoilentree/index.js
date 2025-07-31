import { formatDate } from "@/components/logic/mini-func";
import AdvanceTemplate from "@/components/root/template/advance/advance-template";
import React from "react";

const Index = () => {
  const searchOption = [
    { field: "number", name: "NUMERO" },
    { field: "facture", name: "Facture" },
    { field: "Fournisseur.name", name: "Fournisseur" },
  ];

  const columns = [
    { field: "number", name: "NUMERO" },
    { field: "date", name: "DATE" },
    { field: "price", name: "PRIX UNITAIRE", type: "number" },
    { field: "facture", name: "Facture" },
    { field: "quantity", name: "QTE", type: "number" },
    { field: "Fournisseur.name", name: "Fournisseur" },
  ];
  const inputs = [
    { field: "date", name: "Date", type: "date" },
    { field: "quantity", name: "quantity", type: "number" },
    { field: "price", name: "price par unite", type: "number" },
    { field: "number", name: "numero de bon", type: "number" },
    { field: "facture", name: "facture" },
  ];

  //
  const initialInput = {
    quantity: 6000.0,
    date: formatDate(new Date(Date.now())),
    Fournisseur: { name: "NAFTAL", id: 51 },
    FournisseurId: 51,
    price: 23.5981,
  };
  return (
    <AdvanceTemplate
      initialInput={initialInput}
      searchOption={searchOption}
      columns={columns}
      root={"gasoilentree"}
      onCreateClick={true}
      onDeleteClick={true}
      panel={false}
      option={true}
      onViewClick={true}
      standardEdit={inputs}
      editId={true}
      fieldName={"Fournisseur"}
    />
  );
};

export default Index;
