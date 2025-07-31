// import StandardTemplate from "@/components/root/template/standard/standard-template";
// import React from "react";

// const Index = () => {
//   const searchOption = [
//      { field: "number", name: "Numero de bon " },
//     { field: "date", name: "La date" },
//     { field: "total_price", name: "Le prix total" },
//     { field: "Beneficiare.name", name: "Le beneficiare" },
//     { field: "Vehicule.name", name: "Engine" },
//     { field: "Vehicule.VehiculeClient.name", name: "Client" },
//     { field: "Vehicule.matricule", name: "matricule" },
//   ];

//   const columns = [
//     { field: "number", name: "Numero de bon " },
//     { field: "date", name: "La date" },
//     { field: "total_price", name: "Le prix total" },
//     { field: "Beneficiare.name", name: "Le beneficiare" },
//     { field: "Vehicule.name", name: "Engine" },
//     { field: "Vehicule.VehiculeClient.name", name: "Client" },
//     { field: "Vehicule.matricule", name: "matricule" },
//   ];

//   const panelFilter = [
//     // {
//     //   name: "Le fournisseur",
//     //   field: "Article.Entree.FournisseurId",
//     //   root: "fournisseur",
//     // },
//     // { name: "Unite", field: "Article.UnitId", root: "unit" },
//     // { name: "Nom de la piece", field: "Article.TagId", root: "tag" },
//     {
//       name: "Vehicule",
//       field: "VehiculeId",
//       root: "vehicule",
//     },
//     {
//       name: "Client",
//       field: "Vehicule.VehiculeClientId",
//       root: "vehiculeclient",
//     },

//     {
//       name: "Beneficiare",
//       field: "BeneficiareId",
//       root: "beneficiare",
//     },
//   ];
//   const panelSlider = [
//     { name: "Le prix", field: "total_price", root: "sortie" },
//   ];

//   return (
//     <StandardTemplate
//       // DEEP FILTER
//       panelFilter={panelFilter}
//       panelSlider={panelSlider}

//       searchOption={searchOption}
//       columns={columns}
//       root={"sortie"}
//       // panelFilter={panelFilter}
//       onViewClick={true}
//       option={true}
//       onDeleteClick={true}
//       //
//       sortieChangingName={true}
//     />
//   );
// };

// export default Index;

// // import { getApi, getFournisseur } from "@/components/core/requests/requests";
// // import Loading from "@/components/interface/loading/loading";
// // import BaseTable from "@/components/root/base-table";
// // import React from "react";

// // const Index = () => {
// //   const beneficiare = getApi("beneficiare");

// //   if (beneficiare.isLoading) return <Loading />;

// //   const select = [
// //     {
// //       title: "Beneficiare",
// //       field: "BeneficiareId",
// //       data: beneficiare.data?.data?.data,
// //     },
// //   ];
// //   const obj = { select };

// //   const columns = [
// //     { field: "number", name: "Numero de bon " },
// //     { field: "date", name: "La date" },
// //     { field: "total_price", name: "Le prix total" },
// //     { field: "Beneficiare.name", name: "Le beneficiare" },
// //   ];

// //   return (
// //     <BaseTable
// //       obj={obj}
// //       columns={columns}
// //       root="sortie"
// //       searchingCase={false}
// //     />
// //   );
// // };

// // export default Index;

import content from "@/components/v2/data/tools/sortie.json";
import ShowTable from "@/components/v2/components/show-table";

export default function Home() {
  const router = {
    name: "Sortie",
    field: "/sortie",
    show: true,
    edit: false,
    delete: true,
  };

  return <ShowTable content={content} router={router} />;
}
