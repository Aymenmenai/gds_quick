// import ArticleForm from "@/components/build/form/article-form";
// import EntreeForm from "@/components/build/form/entree-form";
// import StandardForm from "@/components/build/form/StandardForm";
// import MainTable from "@/components/build/table/main-table";
// import MainBtn from "@/components/interface/btn/main-btn";
// import SecondaryBtn from "@/components/interface/btn/secondary-btn";
// import Loading from "@/components/interface/loading/loading";
// import Responsebar from "@/components/interface/responsebar/responsebar";
// import ApiService from "@/components/logic/ApiService";
// import {
//   compareObjects,
//   currencyFormatter,
//   removeUndefinedValues,
//   renderDate,
// } from "@/components/logic/mini-func";
// import { useStoreEntree } from "@/components/state/useEntreeStore";
// import { useStoreArticle } from "@/components/state/useStoreArticle";
// import { useStoreAttributes } from "@/components/state/useStoreAttributes";
// import { Add, Download, Edit, Person, Print } from "@mui/icons-material";
// import { IconButton } from "@mui/material";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import { useMutation, useQuery } from "react-query";

// const TotalPrice = ({ price }) => {
//   return (
//     <>
//       <div className="font-extralight uppercase">{"Le price total: "}</div>
//       <div className="text-2xl font-semibold">
//         {currencyFormatter.format(price)}
//       </div>
//     </>
//   );
// };

// const Id = () => {
//   const requiredFields = [
//     "price",
//     "unit_price",
//     "quantity",
//     "place",
//     "RefId",
//     "TagId",
//     "BrandId",
//     "UnitId",
//     "SousFamilyId",
//   ];

//   const columns = [
//     { field: "Ref.name", name: "Reference" },
//     { field: "name", name: "Designiation" },
//     { field: "date", name: "La date" },
//     { field: "price", name: "Prix" },
//     { field: "initial_quantity", name: "Quantite" },
//     { field: "tax", name: "la tax" },
//     { field: "SousFamily.name", name: "Sous Family" },
//     { field: "Unit.name", name: "Unite" },
//   ];

//   const router = useRouter();

//   if (!router.query.id) {
//     return <Loading />;
//   }

//   let id = router.query.id[0];

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
//   // const [currId, setCurrId] = useState(undefined);

//   const api = new ApiService("entree", id);
//   const articleApi = new ApiService("article");
//   const Entree = useQuery("entree", () => api.getOne());
//   const updateEntree = useMutation((arr) => api.update(arr));
//   const createArticle = useMutation((obj) => articleApi.create(obj));
//   const deleteArticle = useMutation((id) => articleApi.delete(id));
//   const updateArticle = useMutation((id) => articleApi.update(id));

//   // FUNCTIONS
//   const handleOpenNewTab = (url) => {
//     const newTab = window.open(url, "_blank");
//     newTab.focus();
//   };

//   const cancelHandler = () => {
//     emptyArticle();
//     emptyAttribute();
//   };

//   // UPDATE FUNCS
//   const updateFunction = (curr) => {
//     setComparingObj(curr);
//     setArticleData(curr);
//     setAttributeData([...curr.Attributes]);
//   };
//   const edit = () => {
//     const obj = compareObjects({ ...comparingObj }, { ...article });
//     const i = comparingObj.id;
//     // console.log();
//     // console.log(attributes)
//     updateArticle.mutate([i, { ...obj }]);
//   };

//   // UPDATE ENTREE
//   const eUpdate = () => {
//     const firstObj = compareObjects(
//       { ...Entree.data?.data?.data },
//       { ...EntreeState }
//     );
//     const obj = { ...removeUndefinedValues(firstObj) };
//     updateEntree.mutate([Entree.data?.data?.data?.id, { ...obj }]);
//   };

//   // CREATE A CLEAN ARTICLE
//   const validateForm = () => requiredFields.every((field) => article[field]);

//   const handleSubmit = () => {
//     const valid = validateForm();
//     if (!valid) {
//       alert("Remplir tous les champ");
//       console.log(
//         valid,
//         removeUndefinedValues(article),
//         "1108093793182730192731208732109873109"
//       );

//       return;
//     }
//     createArticle.mutate({ ...removeUndefinedValues(article), EntreeId: id });
//   };

//   // // UPDATE ATTRIBUTE
//   // const aUpdate =()=>{

//   // }

//   // USE EFFECT
//   useEffect(() => {
//     Entree.refetch();
//     cancelHandler();
//   }, [createArticle.isSuccess, deleteArticle.isSuccess]);

//   useEffect(() => {
//     Entree.refetch();
//   }, [updateArticle.isSuccess, updateEntree.isSuccess]);

//   // GLOBAL STATE
//   useEffect(() => {
//     initializeEntree({ ...Entree.data?.data?.data });
//   }, [Entree.isSuccess]);

//   // useEffect(() => {
//   //   console.log(requiredFields.filter((field) => !article[field] && field))
//   // }, [article])

//   // LOADING
//   if (Entree.isLoading)
//     return (
//       <>
//         <Loading />
//       </>
//     );

//   const entree = Entree.data?.data?.data;

//   // console.log(article,'--------------qqqqq');
//   return (
//     <>
//       <>
//         {createArticle.isSuccess ||
//         updateArticle.isSuccess ||
//         Entree.isSuccess ? (
//           <Responsebar />
//         ) : (
//           <></>
//         )}
//       </>

//       <div className="flex justify-between items-start ">
//         <div>
//           <div className="text-2xl text-gray-400 uppercase">
//             {`Numéro d'entrée : ${entree.number || "/"}`}
//           </div>
//           <div className="text-sm text-gray-700">{`la date creation de cet entree : ${renderDate(
//             entree.date
//           )}`}</div>
//         </div>
//         <div className="flex justify-end items-center gap-2 ">
//           {/* ADD  */}
//           <ArticleForm
//             entreeDate={entree.date}
//             btn={
//               <IconButton>
//                 <Add />
//               </IconButton>
//             }
//           >
//             {/* FOR ACTION */}
//             <SecondaryBtn func={cancelHandler}>
//               {"Annuler l'opération"}
//             </SecondaryBtn>
//             <MainBtn
//               func={() => {
//                 console.log(article);
//                 handleSubmit();
//                 // createArticle.mutate({ ...article, EntreeId: id });
//               }}
//             >
//               {"Ajouter un article"}
//             </MainBtn>
//           </ArticleForm>

//           {/* EDIT */}
//           <StandardForm
//             title={"modifier l'entrée"}
//             updateFunc={eUpdate}
//             btn={
//               <IconButton>
//                 <Edit />
//               </IconButton>
//             }
//           >
//             <>
//               <EntreeForm data={entree} />
//             </>
//           </StandardForm>
//           <IconButton
//             onClick={() => window.open(`/api/v1/entree/export/${id}`, "_blank")}
//           >
//             <Download />
//           </IconButton>

//           <IconButton
//             onClick={() => {
//               handleOpenNewTab(`/entree/pdf/${id}`);
//             }}
//             size="small"
//           >
//             <Print />
//           </IconButton>
//         </div>
//       </div>
//       <div className="bg-red-800/0 w-full py-4">
//         <div className="flex gap-2 items-center h-7">
//           <div>{`Nom du fournisseur : ${entree.Fournisseur?.name || "/"}`}</div>

//           <IconButton>
//             <Person />
//           </IconButton>
//         </div>

//         <div className="flex gap-2 items-center h-7">
//           <div>{`Facture : ${entree.facture || "/"}`}</div>
//         </div>

//         <div className="flex gap-2 items-center h-7">
//           <div>{`Bon de livraison : ${entree.bon_de_livraison || "/"}`}</div>
//         </div>
//       </div>
//       {/* TABLES */}
//       <div className="w-full h-[70vh] ">
//         <MainTable
//           columns={columns}
//           data={entree.Articles}
//           onEditClick={updateFunction}
//           onDeleteClick={deleteArticle.mutate}
//           editFunc={edit}
//           option={true}
//         >
//           <TotalPrice price={entree.total_price} />
//         </MainTable>
//       </div>
//     </>
//   );
// };

// export default Id;
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Add, Download, Edit, Person, Print } from "@mui/icons-material";
import { IconButton } from "@mui/material";

import ArticleForm from "@/components/build/form/article-form";
import EntreeForm from "@/components/build/form/entree-form";
import StandardForm from "@/components/build/form/StandardForm";
import MainTable from "@/components/build/table/main-table";
import Responsebar from "@/components/interface/responsebar/responsebar";
import Loading from "@/components/interface/loading/loading";
import ApiService from "@/components/logic/ApiService";
import {
  compareObjects,
  currencyFormatter,
  removeUndefinedValues,
  renderDate,
} from "@/components/logic/mini-func";
import { useStoreEntree } from "@/components/state/useStoreEntree";
import { useStoreArticle } from "@/components/state/useStoreArticle";
import { useStoreAttributes } from "@/components/state/useStoreAttributes";

const TotalPrice = ({ price }) => (
  <>
    <div className="font-extralight uppercase">{"Le prix total: "}</div>
    <div className="text-2xl font-semibold">
      {currencyFormatter.format(price)}
    </div>
  </>
);

const Id = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const id = router.query.id?.[0];
  if (!id) return <Loading />;

  const api = new ApiService("entree", id);
  const articleApi = new ApiService("article");

  const { attributes, emptyAttribute, setAttributeData } = useStoreAttributes(
    (state) => state
  );
  const { emptyArticle, setArticleData } = useStoreArticle((state) => state);
  const { entree: EntreeState, initializeEntree } = useStoreEntree(
    (state) => state
  );

  const [comparingObj, setComparingObj] = useState({});

  const Entree = useQuery(["entree", id], () => api.getOne());

  const createArticle = useMutation((obj) => articleApi.create(obj), {
    onSuccess: () => {
      queryClient.invalidateQueries(["entree", id]);
      cancelHandler();
    },
  });

  const updateArticle = useMutation(
    ([articleId, data]) => articleApi.update([articleId, data]),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["entree", id]);
        // cancelHandler();
        router.reload();
      },
    }
  );

  const deleteArticle = useMutation(
    (articleId) => articleApi.delete(articleId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["entree", id]);
      },
    }
  );

  const updateEntree = useMutation(
    ([entreeId, data]) => api.update([entreeId, data]),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["entree", id]);
      },
    }
  );

  const cancelHandler = () => {
    emptyArticle();
    emptyAttribute();
  };

  const updateFunction = (curr) => {
    setComparingObj(curr);
    setArticleData(curr);
    setAttributeData([...curr.Attributes]);
  };

  const eUpdate = () => {
    const updated = compareObjects(Entree.data?.data?.data, EntreeState);
    const cleaned = removeUndefinedValues(updated);
    updateEntree.mutate([Entree.data?.data?.data?.id, cleaned]);
  };

  const requiredFields = [
    "price",
    "unit_price",
    "quantity",
    "place",
    "RefId",
    "TagId",
    "BrandId",
    "UnitId",
    "SousFamilyId",
  ];

  const add_handler = (article) => {
    const valid = requiredFields.every((field) => article[field]);
    if (!valid) {
      alert("Remplir tous les champs requis");
      return;
    }

    const payload = {
      ...removeUndefinedValues(article),
      EntreeId: id,
      Attributes: attributes,
    };

    createArticle.mutate(payload);
  };

  const edit_handle = (oldData, newData) => {
    const changes = compareObjects(oldData, newData);
    const payload = removeUndefinedValues(changes);
    updateArticle.mutate([oldData.id, payload]);
  };

  useEffect(() => {
    if (Entree.isSuccess) {
      initializeEntree({ ...Entree.data?.data?.data });
    }
  }, [Entree.isSuccess]);

  if (Entree.isLoading) return <Loading />;

  const entree = Entree.data?.data?.data;
  const articles = entree?.Articles || [];

  const columns = [
    { field: "Ref.name", name: "Référence" },
    { field: "name", name: "Désignation" },
    { field: "date", name: "Date" },
    { field: "price", name: "Prix" },
    { field: "initial_quantity", name: "Quantité" },
    { field: "tax", name: "Taxe" },
    { field: "SousFamily.name", name: "Sous-Famille" },
    { field: "Unit.name", name: "Unité" },
  ];

  return (
    <>
      {(createArticle.isSuccess ||
        updateArticle.isSuccess ||
        Entree.isSuccess) && <Responsebar />}

      <div className="flex justify-between items-start ">
        <div>
          <div className="text-2xl text-gray-400 uppercase">
            {`Numéro d'entrée : ${entree?.number || "/"}`}
          </div>
          <div className="text-sm text-gray-700">
            {`Date de création : ${renderDate(entree?.date)}`}
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <ArticleForm
            onSubmit={add_handler}
            icon={<Add />}
            entreeDate={entree?.date}
          />
          <StandardForm
            title="Modifier l'entrée"
            updateFunc={eUpdate}
            btn={
              <IconButton>
                <Edit />
              </IconButton>
            }
          >
            <EntreeForm data={entree} />
          </StandardForm>
          <IconButton
            onClick={() => window.open(`/api/v1/entree/export/${id}`, "_blank")}
          >
            <Download />
          </IconButton>
          <IconButton
            onClick={() => window.open(`/entree/pdf/${id}`, "_blank")}
          >
            <Print />
          </IconButton>
        </div>
      </div>

      <div className="w-full py-4">
        <div className="flex gap-2 items-center h-7">
          <div>{`Fournisseur : ${entree?.Fournisseur?.name || "/"}`}</div>
          <IconButton>
            <Person />
          </IconButton>
        </div>
        <div className="flex gap-2 items-center h-7">
          <div>{`Facture : ${entree?.facture || "/"}`}</div>
        </div>
        <div className="flex gap-2 items-center h-7">
          <div>{`Bon de livraison : ${entree?.bon_de_livraison || "/"}`}</div>
        </div>
      </div>

      <div className="w-full h-[70vh]">
        <MainTable
          columns={columns}
          data={articles}
          onEditClick={updateFunction}
          onDeleteClick={deleteArticle.mutate}
          editFunc={edit_handle}
          option={true}
        >
          <TotalPrice price={entree?.total_price} />
        </MainTable>
      </div>
    </>
  );
};

export default Id;
