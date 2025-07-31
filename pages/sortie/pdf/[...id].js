import Loading from "@/components/interface/loading/loading";
import SortiePdf from "@/components/base/pdf/sortie-pdf";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";

const Id = () => {
  const router = useRouter();

  if (!router.query.id) {
    return <Loading />;
  }

  let id = router.query.id[0];
  const data = useQuery("Sortie", () => {
    return axios.get(`/api/v1/sortie/find/${id}`);
  });

  if (data.isLoading) return <Loading />;

  // console.log(data.data?.data?.data);
  return (
    <>
      <SortiePdf data={data.data?.data?.data} />
    </>
  );
};

export default Id;
