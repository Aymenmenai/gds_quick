import StandardTemplate from "@/components/root/template/standard/standard-template";
import React from "react";

const Index = () => {
  const searchOption = [{ field: "name", name: "Unité" }];

  const columns = [
    { field: "name", name: " Unité" },
    { field: "createdAt", name: "date" },
  ];
  const inputs = [{ field: "name", name: "Unité" }];

  //
  return (
    <StandardTemplate
      searchOption={searchOption}
      columns={columns}
      root={"unit"}
      onCreateClick={true}
      onDeleteClick={true}
      panel={false}
      option={true}
      standardEdit={inputs}
    />
  );
};

export default Index;
