import * as React from "react";
import Button from "@mui/material/Button";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useMutation } from "react-query";
import axios from "axios";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import MainBtn from "../btn/main-btn";

function MyApp({ func, id, refetch }) {
  const { enqueueSnackbar } = useSnackbar();

  const handleClickVariant = () => {
    func.mutate(id);
  };

  React.useEffect(() => {
    if (func.isSuccess) {
      enqueueSnackbar("Success", { variant: "success" });
      refetch();
    } else if (func.isError) {
      enqueueSnackbar("Error", { variant: "error" });
    }
  }, [func.isSuccess, func.isError, enqueueSnackbar]);

  return <MainBtn func={handleClickVariant}>supprimer définitivement</MainBtn>;
}

export default function ResDelete({ url, id, refetch }) {
  const mutation = useMutation({
    mutationFn: (obj) => {
      return axios.delete(`/api/v1/${url}/delete/${id}`, obj);
    },
  });

  return (
    <SnackbarProvider maxSnack={3}>
      <MyApp func={mutation} refetch={refetch} id={id} />
    </SnackbarProvider>
  );
}
