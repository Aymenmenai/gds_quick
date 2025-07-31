import StandardTemplate from "@/components/root/template/standard/standard-template";
import React from "react";

const Index = () => {
  const searchOption = [{ field: "Beneficiare.name", name: "BENEFICIARE" }];

  const columns = [
    { field: "number", name: "Numero" },
    { field: "date", name: "date" },
    { field: "total_price", name: "prix total" },
    { field: "Beneficiare.name", name: "beneficiare" },
  ];

  return (
    <StandardTemplate
      searchOption={searchOption}
      columns={columns}
      root={"gasoilsortie"}
      onViewClick={true}
      option={true}
      onDeleteClick={true}
    />
  );
};

export default Index;

