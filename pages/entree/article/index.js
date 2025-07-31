// import ApiService from "@/components/logic/ApiService";
// import { compareObjects } from "@/components/logic/mini-func";
// import StandardTemplate from "@/components/root/template/standard/standard-template";
// import { useStoreEntree } from "@/components/state/useEntreeStore";
// import { useStoreArticle } from "@/components/state/useStoreArticle";
// import { useStoreAttributes } from "@/components/state/useStoreAttributes";
// import React, { useEffect, useState } from "react";
// import { useMutation, useQueryClient } from "react-query";

// const Index = () => {
//   const queryClient = useQueryClient();

//   const articleApi = new ApiService("article");
//   // state
//   const { attributes, emptyAttribute, setAttributeData } = useStoreAttributes(
//     (state) => state
//   );
//   const { emptyArticle, article, setArticleData } = useStoreArticle(
//     (state) => state
//   );
//   const { entree: EntreeState, initializeEntree } = useStoreEntree(
//     (state) => state
//   );

//   const [comparingObj, setComparingObj] = useState({});

//   const updateArticle = useMutation((id) => articleApi.update(id));

//   const updateFunction = (curr) => {
//     // console.log(curr, "HELLO");
//     setComparingObj(curr);
//     setArticleData(curr);
//     if (curr.Attributes) {
//       setAttributeData([...curr.Attributes]);
//     }
//   };

//   const editFunc = (e) => {
//     // console.log(e,'Hello')
//     const obj = compareObjects({ ...comparingObj }, { ...article });
//     const i = comparingObj.id;
//     // console.log(obj);
//     // console.log(i);
//     updateArticle.mutate([i, { ...obj }]);
//   };

//   const searchOption = [
//     { field: "Ref.name", name: "REFERENCE" },
//     { field: "name", name: "DESIGNATION" },
//     { field: "date", name: "DATE" },
//     { field: "price", name: "PRIX" },
//     { field: "initial_quantity", name: "QTE D'ENTREE" },
//     { field: "quantity", name: "QTE EN STOCK" },
//     { field: "Ref.Reference.alert", name: "STOCK MIN" },
//     { field: "SousFamily.name", name: "SOUS-FAMILLE" },
//     { field: "Unit.name", name: "U" },
//     { field: "place", name: "Emplacement" },
//     { field: "Entree.number", name: "ENTREE" },
//     { field: "Entree.Fournisseur.name", name: "Fournisseur" },
//   ];

//   const columns = [
//     { field: "Ref.name", name: "REFERENCE" },
//     { field: "name", name: "DESIGNATION" },
//     { field: "date", name: "DATE" },
//     { field: "price", name: "PRIX" },
//     { field: "initial_quantity", name: "QTE D'ENTREE" },
//     { field: "quantity", name: "QTE EN STOCK" },
//     { field: "Ref.Reference.alert", name: "STOCK MIN" },
//     { field: "SousFamily.name", name: "SOUS-FAMILLE" },
//     { field: "Unit.name", name: "U" },
//     { field: "place", name: "Emplacement" },
//     { field: "Entree.number", name: "ENTREE" },
//     { field: "Entree.Fournisseur.name", name: "Fournisseur" },
//   ];

//   const panelFilter = [
//     {
//       name: "Fournisseur",
//       field: "Entree.FournisseurId",
//       root: "fournisseur",
//     },
//     { name: "U", field: "UnitId", root: "unit" },
//     { name: "SOUS-FAMILLE", field: "SousFamilyId", root: "sousFamily" },
//     { name: "FAMILLE", field: "SousFamily.FamilyId", root: "family" },
//     { name: "PIECE", field: "TagId", root: "tag" },
//   ];

//   // console.log(compareObjects({ ...comparingObj }, { ...article }))
//   //
//   // console.log("010000000", ids);
//   useEffect(() => {
//     queryClient.invalidateQueries("articles");
//   }, [updateArticle.isSuccess]);
//   return (
//     <StandardTemplate
//       selection={true} // FOR CHECKBOX
//       sortiebtn={true}
//       searchOption={searchOption}
//       columns={columns}
//       root={"article"}
//       // RELATED WITH PANEL
//       panelFilter={panelFilter}
//       // onEditClick={updateFunction}
//       // editFunc={editFunc}
//       // FUNCTION
//       onViewClick={false}
//       // extra={"quantity[gte]=1"}
//       // option={true}
//       isExport
//     />
//   );
// };

// export default Index;

import content from "@/components/v2/data/tools/article.json";
import ShowTable from "@/components/v2/components/show-table";

export default function Home() {
  const router = {
    name: "Article d'entree",
    field: "/article",
    show: false,
    edit: true,
    delete: true,
  };

  return <ShowTable router={router} content={content} />;
}
