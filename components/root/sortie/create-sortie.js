import SortieForm from "@/components/build/form/sortie-form";
import MainBtn from "@/components/interface/btn/main-btn";
import ApiService from "@/components/logic/ApiService";
import { currencyFormatter } from "@/components/logic/mini-func";
import { useStoreAQS, useStoreSortie } from "@/components/state/useStoreSortie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";

export default function CreateSortie() {
  const [time, setTime] = useState(new Date().getFullYear());
  const router = useRouter();
  const { ids, emptyAQS } = useStoreAQS((state) => state);
  const { fillSortie, sortie, emptySortie } = useStoreSortie((state) => state);
  const Api = new ApiService("sortie", undefined);

  const count = useMutation("Num of sortie", (data) => Api.count(data));
  const addSortie = useMutation((obj) => Api.create(obj));

  const columns = [
    { field: "Ref.name", name: "Reference" },
    { field: "name", name: "Nom d'article" },
    { field: "price", name: "Prix" },
    { field: "quantityChangable", name: "Quantite" },
    { field: "Unit.name", name: "Unite" },
  ];

  const submitSortie = () => {
    // console.log(ids);
    let number = count.data.data.data + 1;
    let aqsIds = [...ids];
    let sortieInfo = { ...sortie };
    fillSortie({});
    // let data =
    emptyAQS();
    emptySortie();
    addSortie.mutate({
      Articles: [...aqsIds],
      ...sortieInfo,
      number,
    });
  };

  // const deleteSortie = (index) => {
  //   let articles = [...sortie.Articles];
  //   articles.splice(index, 1);
  //   console.log(articles, "DELETE SORTIE ARTICLE");
  //   fillSortie("Articles", articles);
  // };

  useEffect(() => {
    if (sortie.date) {
      setTime(sortie.date.split("-")[0]);
    }
  }, [sortie.date]);

  useEffect(() => {
    count.mutate(time);
  }, [time]);

  // useEffect(() => {
  // }, [count.data?.data?.data]);

  // if (count.isLoading) return <Loading />;
  if (addSortie.isSuccess) {
    router.push(`/sortie/${addSortie.data?.data?.data}`);
  }

  //console.log(sortie, "here is the");

  return (
    <div className="h-[92vh] overflow-hidden w-full ">
      {/* DASHBOARD */}
      <div className="">
        <div className="flex justify-between items-center ">
          <div>
            <div className="text-2xl text-gray-400 uppercase">
              {`Numéro de la sortie : ${
                count.data ? count.data?.data?.data + 1 : ""
              }`}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 items-end justify-start py-2 ">
          <SortieForm />
          <div className="flex gap-2 justify-end items-center">
            {sortie.BeneficiareId && (
              <div>
                <MainBtn func={submitSortie}>{"Creez la sortie"}</MainBtn>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
