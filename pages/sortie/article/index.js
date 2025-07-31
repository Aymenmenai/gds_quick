// import StandardTemplate from "@/components/root/template/standard/standard-template";
// import React from "react";

// const Index = () => {
//   const searchOption = [
//     { field: "Article.Ref.name", name: "Reference" },
//     { field: "Article.name", name: "Designiation" },
//     { field: "Article.Entree.number", name: "bon d'entree" },
//     { field: "Sortie.number", name: "bon de sortie" },
//   ];

//   const columns = [
//     { field: "Article.Ref.name", name: "Reference" },
//     { field: "Article.name", name: "Designiation" },
//     { field: "date", name: "La date" },
//     { field: "price", name: "Prix" },
//     { field: "quantity", name: "Quantite" },
//     { field: "Article.Unit.name", name: "Unite" },
//     { field: "Article.SousFamily.name", name: "Sous Family" },
//     { field: "Article.Entree.number", name: "Bon d'entree" },
//     { field: "Sortie.number", name: "Bon de sortie" },
//     { field: "Sortie.Beneficiare.name", name: "Le beneficiare" },
//     { field: "Sortie.Vehicule.name", name: "Vehicule" },
//   ];

//   const panelFilter = [
//     {
//       name: "Le fournisseur",
//       field: "Article.Entree.FournisseurId",
//       root: "fournisseur",
//     },
//     { name: "Unite", field: "Article.UnitId", root: "unit" },
//     { name: "Nom de la piece", field: "Article.TagId", root: "tag" },
//     {
//       name: "Beneficiare",
//       field: "BeneficiareId",
//       root: "beneficiare",
//     },
//   ];

//   return (
//     <StandardTemplate
//       searchOption={searchOption}
//       columns={columns}
//       root={"articlequisort"}
//       panelFilter={panelFilter}
//       isExport
//     />
//   );
// };

// export default Index;

import content from "@/components/v2/data/tools/articlequisort.json";
import ShowTable from "@/components/v2/components/show-table";

export default function Home() {
  const router = {
    name: "Article Sortant",
    field: "/articlequisort",
    show: false,
    edit: false,
    delete: false,
  };

  return <ShowTable content={content} router={router} />;
}
