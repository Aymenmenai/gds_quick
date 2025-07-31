import StandardTemplate from "@/components/root/template/standard/standard-template";
import React from "react";

const Index = () => {
  const searchOption = [{ field: "name", name: "Bénéficiaire" }];

  const columns = [
    // { field: "id", name: "Dev" },
    { field: "name", name: "NOM" },
    // { field: "BeneficiareHistories.prevVal", name: "Valeur Précédente" },
    // { field: "BeneficiareHistories.User.name", name: "Dernière Modification Par" },
    // { field: "BeneficiareHistories.createdAt", name: "Date de la Modification" },
    // { field: "createdAt", name: "Date de Création" },
    { field: "User.name", name: "Créateur" },
  ];

  const inputs = [{ field: "name", name: "Bénéficiaire" }];

  //
  return (
    <StandardTemplate
      searchOption={searchOption}
      columns={columns}
      root={"beneficiare"}
      onCreateClick={true}
      onDeleteClick={false}
      panel={false}
      option={false}
      standardEdit={inputs}
    />
  );
};

export default Index;
