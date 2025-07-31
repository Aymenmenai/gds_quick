import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useMutation } from "react-query";
import axios from "axios";
import { useRouter } from "next/router";
import MainBtn from "../btn/main-btn";
import Slide from "@mui/material/Slide";

function MyApp({ func, data, refetch, text, push, url }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleClickVariant = () => {
    func.mutate(data);
  };

  useEffect(() => {
    const handleSuccess = () => {
      enqueueSnackbar("Success", {
        variant: "success",
        anchorOrigin: {
          color: "white",

          vertical: "top",
          horizontal: "center",
        },
        transitionComponent: Slide, // Use SlideTransition here
        SnackbarContentProps: {
          style: { color: "#FFFFFF", backgroundColor: "#4CAF50" }, // Change colors here
        },
      });
      refetch();
      if (push) {
        router.push(`/${url}/${func.data.data.data}`);
      }
    };

    const handleError = () => {
      enqueueSnackbar("Error", {
        variant: "error",
        anchorOrigin: {
          color: "white",
          vertical: "top",
          horizontal: "center",
        },
        transitionComponent: Slide, // Use SlideTransition here
        SnackbarContentProps: {
          style: { color: "#FFFFFF", backgroundColor: "#F44336" }, // Change colors here
        },
      });
    };

    if (func.isSuccess) {
      handleSuccess();
    } else if (func.isError) {
      handleError();
    }
  }, [
    func.isSuccess,
    func.isError,
    enqueueSnackbar,
    refetch,
    push,
    router,
    url,
  ]);

  return (
    <MainBtn func={handleClickVariant}>
      {func.isLoading ? "Loading..." : text}
    </MainBtn>
  );
}

export default function Res({
  url,
  data,
  refetch = () => {},
  text = "Ajouter",
  push = false,
}) {
  const mutation = useMutation((obj) => axios.post(`/api/v1/${url}/add`, obj));

  return (
    <SnackbarProvider maxSnack={3}>
      <MyApp
        func={mutation}
        refetch={refetch}
        data={data}
        text={text}
        push={push}
        url={url}
      />
    </SnackbarProvider>
  );
}
