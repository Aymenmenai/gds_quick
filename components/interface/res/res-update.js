import * as React from "react";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useMutation } from "react-query";
import axios from "axios";
import MainBtn from "../btn/main-btn";

function MyApp({ func, data, refetch }) {
  const { enqueueSnackbar } = useSnackbar();

  // console.log(data);
  const handleClickVariant = () => {
    func.mutate(data);
  };

  React.useEffect(() => {
    if (func.isSuccess) {
      refetch();
      enqueueSnackbar("Success", { variant: "success" });
    } else if (func.isError) {
      enqueueSnackbar("Error", { variant: "error" });
    }
  }, [func.isSuccess, func.isError, enqueueSnackbar]);

  return (
    <MainBtn func={handleClickVariant}>
      {func.isLoading ? "Loading..." : "Modify"}
    </MainBtn>
  );
}

export default function ResUpdate({ url, id, data, refetch }) {
  const mutation = useMutation({
    mutationFn: (obj) => {
      return axios.patch(`/api/v1/${url}/update/${id}`, obj);
    },
  });

  return (
    <SnackbarProvider maxSnack={3}>
      <MyApp func={mutation} refetch={refetch} data={data} />
    </SnackbarProvider>
  );
}
