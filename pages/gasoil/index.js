import { formatDate } from "@/components/logic/mini-func";
import AdvanceTemplate from "@/components/root/template/advance/advance-template";
import React from "react";

const Index = () => {
  const searchOption = [
    { field: "number", name: "NUMERO DE BON DE SORTIE (PAR LITRE)" },
    { field: "facture", name: "Facture" },
    { field: "Beneficiare.name", name: "Beneficiare" },
  ];

  const columns = [
    { field: "number", name: "NUMERO" },
    { field: "date", name: "DATE" },
    { field: "price", name: "PRIX UNITAIRE", type: "number" },
    { field: "quantity", name: "QTE", type: "number" },
    { field: "Beneficiare.name", name: "Beneficiare" },
  ];
  const inputs = [
    { field: "date", name: "Date", type: "date" },
    { field: "quantity", name: "quantity (litre)", type: "number" },
    { field: "price", name: "price par unite", type: "number" },
    { field: "number", name: "numero de bon", type: "number" },
  ];

  //

  const initialInput = {
    quantity: 500.0,
    date: formatDate(new Date(Date.now())),
    BeneficiareId: 1,
    price: 23.5981,
  };
  return (
    <AdvanceTemplate
      initialInput={initialInput}
      searchOption={searchOption}
      columns={columns}
      root={"gasoil"}
      onCreateClick={true}
      onDeleteClick={true}
      panel={false}
      option={true}
      onViewClick={true}
      standardEdit={inputs}
      editId={true}
      fieldName={"Beneficiare"}
    />
  );
};

export default Index;
