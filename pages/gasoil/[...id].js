import Loading from "@/components/interface/loading/loading";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import GasoilLiterPdf from "@/components/base/pdf/gasoil-liter-pdf";

const Id = () => {
  const columns = [
    { field: "", name: "Référence" },
    { field: "", name: "Désignation" },
    { field: "quantity", name: "Q(L)" },
    { field: "price", name: "Prix U HT" },
  ];

  const router = useRouter();

  if (!router.query.id) {
    return <Loading />;
  }

  let id = router.query.id[0];
  const data = useQuery("Liter", () => {
    return axios.get(`/api/v1/gasoil/find/${id}`);
  });

  if (data.isLoading) return <Loading />;

  // console.log(data.data.data);
  return (
    <>
      <GasoilLiterPdf
        data={data.data?.data?.data}
        code={"04006"}
        columns={columns}
      />
    </>
  );
};

export default Id;
