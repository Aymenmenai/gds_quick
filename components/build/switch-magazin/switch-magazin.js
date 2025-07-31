import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import StandardSelect from "@/components/base/input/standard-select";
import ApiService from "@/components/logic/ApiService";
import { useRouter } from "next/router";

function SwitchMagazin() {
  const router = useRouter();

  const api = new ApiService("user");
  const {
    isLoading,
    isError,
    data: userData,
    error: userError,
    refetch: refetchUser,
  } = useQuery("currUser", api.getCurrUser);
  const [magazin, setMagazin] = useState({
    name: "",
    id: "",
  });

  const mutation = useMutation((data) => api.updateUser(data), {
    onSuccess: () => {
      refetchUser();
    },
  });

  const getNewMagazinId = (data) => {
    // console.log(data)
    if (!!data) {
      // setMagazin({id: data });
      mutation.mutate({ MagazinId: data });
    }

    router.push("/");
  };

  useEffect(() => {
    if (userData) {
      const currMagazin = userData?.data?.data.Magazin;
      setMagazin(currMagazin);
    }
  }, [userData]);

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (isError) {
    return <div>Error: {userError.message}</div>;
  }
  if (mutation.isSuccess) {
    router.reload();
  }

  const initVal = { name: magazin.name, id: magazin.id };
  console.log(magazin);
  return (
    <div className="flex justify-center w-72">
      <StandardSelect
        value={initVal}
        route={"magazin"}
        field={"magazin"}
        title={"Magazin"}
        func={(val, data) => getNewMagazinId(data)}
        add={false}
      />
    </div>
  );
}

export default SwitchMagazin;
