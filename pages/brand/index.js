import StandardTemplate from "@/components/root/template/standard/standard-template";
import React from "react";

const Index = () => {
  const columns = [
    { field: "name", name: "MARQUE" },
    { field: "createdAt", name: "DATE" },
  ];
  const inputs = [{ field: "name", name: "MARQUE" }];

  //
  return (
    <StandardTemplate
      searchOption={inputs}
      columns={columns}
      root={"brand"}
      onCreateClick={true}
      onDeleteClick={true}
      panel={false}
      option={true}
      standardEdit={inputs}
    />
  );
};

export default Index