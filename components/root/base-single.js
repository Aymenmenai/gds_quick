import { Download, Edit, Print } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";
import Container from "../design/container";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import axios from "axios";
import Loading from "../interface/loading/loading";
import MainTable from "../build/table/base-table";
import RowComponent from "../core/tables/rows/row-component";

const BaseSingle = ({
  columns,
  form,
  info,
  root,
  data,
  children,
  updateFunc = false,
  refetch = () => {},
}) => {
  const router = useRouter();

  //   console.log(router)
  // const { data, isLoading, isError } = useQuery("entreearticles", () => {
  //   return axios.get(`/api/v1/${root}/all?EntreeId=${router.query.id[0]}`);
  // });

  // if (isLoading) {
  //   return <Loading />;
  // }
  // if (isError) {
  //   return <>Error</>;
  // }
  return (
    <Container form={form} func={router}>
      {children}
      <MainTable columns={columns}>
        <RowComponent
          updateFunc={updateFunc}
          refetch={refetch}
          root={root}
          rows={data}
        />
      </MainTable>
    </Container>
  );
};

export default BaseSingle;
