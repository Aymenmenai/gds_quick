import Loading from "@/components/interface/loading/loading";
import EntreePdf from "@/components/base/pdf/entree-pdf";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import GasoilEntreePdf from "@/components/base/pdf/gasoil-entree-pdf";

const Id = () => {
  const columns = [
    { field: "", name: "Référence" },
    { field: "", name: "Désignation" },
    { field: "quantity", name: "Qté" },
    { field: "price", name: "Prix U HT" },
  ];

  const router = useRouter();

  if (!router.query.id) {
    return <Loading />;
  }

  let id = router.query.id[0];
  const data = useQuery("Entree", () => {
    return axios.get(`/api/v1/gasoilentree/find/${id}`);
  });

  if (data.isLoading) return <Loading />;

  // console.log(data.data.data);
  return (
    <>
      <GasoilEntreePdf
        data={data.data?.data?.data}
        code={"04005"}
        columns={columns}
      />
    </>
  );
};

export default Id;
