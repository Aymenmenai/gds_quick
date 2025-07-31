import StandardTemplate from "@/components/root/template/standard/standard-template";
import React from "react";

const Index = () => {
  const columns = [
    { field: "name", name: "Nom de la Pièce" },
    { field: "TagHistories.prevVal", name: "Valeur Précédente" },
    { field: "TagHistories.User.name", name: "Dernière Modification Par" },
    { field: "TagHistories.createdAt", name: "Date de la Modification" },
    { field: "createdAt", name: "Date de Création" },
    { field: "User.name", name: "Créateur" },
];

  const inputs = [{ field: "name", name: "pièce" }];

  //
  return (
    <StandardTemplate
      searchOption={inputs}
      columns={columns}
      root={"tag"}
      onCreateClick={true}
      onDeleteClick={false}
      panel={false}
      option={true}
      standardEdit={inputs}
    />
  );
};

export default Index;
