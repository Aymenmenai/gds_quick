import StandardTemplate from "@/components/root/template/standard/standard-template";
import React from "react";

const Index = () => {
  const fields = [
    { name: "Nom", field: "name" }, // "Nom" corresponds to "Name"
    { name: "Adresse", field: "address" }, // "Adresse" corresponds to "Address"
    { name: "Email", field: "email" }, // "Email" corresponds to "Email"
    { name: "Numéro de téléphone", field: "phone" }, // "Numéro de téléphone" corresponds to "Phone Number"
    { name: "Fax", field: "fax" },
  ];

  // const fields = [
  //   { name: "Nom", field: "name" }, // "Nom" corresponds to "Name"
  // ];
  // const columns = [
  //   { field: "name", name: "Nom du Fournisseur" },
  //   { field: "FournisseurHistories.prevVal", name: "Valeur Précédente" },
  //   { field: "FournisseurHistories.User.name", name: "Dernière Modification Par" },
  //   { field: "FournisseurHistories.createdAt", name: "Date de la Modification" },
  //   { field: "entree_count", name: "Le nombre des entree" },
  //   { field: "createdAt", name: "Date de Création" },
  //   { field: "User.name", name: "Créateur" },
  // ];

  return (
    <StandardTemplate
      searchOption={fields}
      columns={fields}
      root={"fournisseur"}
      onCreateClick={true}
      onDeleteClick={false}
      panel={false}
      option={true}
      standardEdit={fields}
    />
  );
};

export default Index;
