import React, { useEffect, useState } from "react";
import Loading from "@/components/interface/loading/loading";
import MainTable from "../../build/table/main-table";
import { useMutation, useQuery } from "react-query";
import ArticleForm from "@/components/build/form/article-form";
import EntreeForm from "@/components/build/form/entree-form";
import {
  calculateTotalPrice,
  currencyFormatter,
} from "@/components/logic/mini-func";
import MainBtn from "@/components/interface/btn/main-btn";
import SecondaryBtn from "@/components/interface/btn/secondary-btn";
import { useStoreArticle } from "@/components/state/useStoreArticle";
import { useStoreAttributes } from "@/components/state/useStoreAttributes";
import { useStoreEntree } from "@/components/state/useStoreEntree";
import ApiService from "@/components/logic/ApiService";
import Request from "@/components/build/request/request";
import { useRouter } from "next/router";

const TotalPrice = ({ price }) => {
  return (
    <>
      <div className="font-extralight uppercase">{"Le price total: "}</div>
      <div className="text-2xl font-semibold">
        {currencyFormatter.format(price).replace("DZD", "DA").trim()}
      </div>
    </>
  );
};

const CreateEntree = () => {
  const [time, setTime] = useState(new Date().getFullYear());
  const router = useRouter();
  const { emptyArticle, article, setArticleData } = useStoreArticle(
    (state) => state
  );
  const { emptyAttribute } = useStoreAttributes((state) => state);
  const { entree, fillEntree, emptyEntree } = useStoreEntree((state) => state);

  const Api = new ApiService("entree", undefined);
  // MUTATION
  // ADD ENTREE
  const addEntree = useMutation((data) => Api.create(data));
  // COUNTER
  const count = useMutation("Num of entree", (data) => Api.count(data));
  // FUNCTIONS
  const cancelHandler = () => {
    emptyArticle();
    emptyAttribute();
  };
  // ADD VALUE TO THE ENTREE
  const articleToEntree = () => {
    const arr = entree.Articles ? [...entree.Articles] : [];
    arr.push(article);
    fillEntree("Articles", arr);
    cancelHandler();
  };
  // DELETE AN ARTICLE FROM THE ENTREE
  const deleteArticle = (index) => {
    const articles = [...entree.Articles];
    articles.splice(index, 1);
    fillEntree("Articles", articles);
  };

  const submitEntree = () => {
    const data = { ...entree, number: count.data?.data?.data + 1 };
    addEntree.mutate({ ...data });
    cancelHandler();
    emptyEntree();
    // count.refetch();
  };

  // GET YEAR
  // const getYear = (e) => {
  //   e.preventDefault();
  //   count.(e.target.value);
  //   // count.mutate(e.target.value);
  // };

  const editFunc = (index) => {
    const arr = entree.Articles;
    arr[index] = article;
    fillEntree("Articles", arr);
    // fillEntree("number", count.data?.data?.data + 1);
  };

  // useEffect(() => {
  //   // count.refetch();
  //   // fillEntree("number", count.data?.data?.data + 1);
  // }, [addEntree.isSuccess]);

  useEffect(() => {
    emptyArticle();
    emptyAttribute();
    emptyEntree();
  }, []);

  useEffect(() => {
    if (entree.date) {
      setTime(entree.date.split("-")[0]);
    }
  }, [entree.date]);

  useEffect(() => {
    count.mutate(time);
  }, [time]);

  // LOADING STATES
  // if (count.isLoading) return <Loading />;
  // TABLE COLUMN
  const columns = [
    { field: "Ref.name", name: "Reference" },
    { field: "name", name: "Nom d'article" },
    { field: "date", name: "La date" },
    { field: "price", name: "Prix" },
    { field: "quantity", name: "Quantite" },
    { field: "SousFamily.name", name: "Sous family" },
    { field: "Unit.name", name: "Unite" },
  ];

  // console.log(addEntree.data?.data?.data, "value");
  // console.log(entree, "Entree");
  // console.log(count, "Entree");
  // console.log("ARTICLE", article);
  if (addEntree.isSuccess) {
    router.push(`/entree/${addEntree.data?.data?.data}`);
  }
  return (
    <>
      {addEntree.isSuccess ? <Request req={addEntree} /> : <></>}
      <div className="h-[92vh] overflow-hidden w-full ">
        {/* DASHBOARD */}
        <div className="">
          <div className="flex justify-between items-center ">
            <div>
              <div className="text-2xl text-gray-400 uppercase">
                {`Numéro d'entrée : ${
                  count.data ? count.data?.data?.data + 1 : ""
                }`}
              </div>
            </div>
            {/* <input
              type="number"
              min="2000"
              max="2099"
              step="1"
              onChange={(event) => getYear(event)}
              defaultValue={`${new Date().getFullYear()}`}
            /> */}
          </div>
          <div className="flex flex-col gap-2 items-end justify-start py-2 ">
            <EntreeForm isNumber={false} data={{ date: Date.now() }} />
            <div className="flex gap-2 justify-end items-center">
              {/* <ArticleForm
                btn={
                  <>
                    <MainBtn func={() => {}}>
                      {"Créez un article pour cette entrée"}
                    </MainBtn>
                  </>
                }
              >
                {/* FOR ACTION *
                <SecondaryBtn func={cancelHandler}>
                  {"Annuler l'opération"}
                </SecondaryBtn>
                <MainBtn func={articleToEntree}>{"Ajouter un article"}</MainBtn>
              </ArticleForm> */}
              <div>
                {entree.FournisseurId && (
                  <MainBtn func={submitEntree}>{"Creez l'entree"}</MainBtn>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CreateEntree;
