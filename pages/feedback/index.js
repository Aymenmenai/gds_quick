import StandardTemplate from "@/components/root/template/standard/standard-template";
import React from "react";

const Index = () => {
  const columns = [
    { field: "User.name", name: "Utilizateur" },
    { field: "message", name: "Message" },
    { field: "isFixed", name: "Problem solve" },
    { field: "createdAt", name: "date de création" },
  ];
  const inputs = [{ field: "message", name: "Message" }];

  //
  return (
    <StandardTemplate
      searchOption={inputs}
      columns={columns}
      root={"feedback"}
      onCreateClick={true}
      onDeleteClick={true}
      panel={false}
      option={true}
      standardEdit={inputs}
    />
  );
};

export default Index;
