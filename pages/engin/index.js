import AdvanceTemplate from "@/components/root/template/advance/advance-template";
import React from "react";

const Index = () => {
  // const searchOption = [
  //   { field: "name", name: "le nom de vehicule" },
  //   { field: "VehiculeCodes.name", name: "Code" },
  // ];

  const columns = [
    { field: "Brand.name", name: "Marque" },
    // { field: "VehiculeType.name", name: " Type" },
    { field: "name", name: "DESIGNATION" },
    // { field: "matricule", name: "Matricule" },
    // { field: "serialCode", name: " Code de serie" },
  ];
  const inputs = [
    { field: "name", name: "NOME DE VEHICULE" },
    // { field: "matricule", name: "Matricule" },
    // { field: "serialCode", name: " Code de serie" },
  ];

  //
  return (
    <AdvanceTemplate
      searchOption={columns}
      columns={columns}
      root={"vehiculetype"}
      onCreateClick={true}
      onDeleteClick={true}
      panel={false}
      option={true}
      standardEdit={inputs}
      editId={false}
      fieldName={"Brand"}
    />
  );
};

export default Index;
