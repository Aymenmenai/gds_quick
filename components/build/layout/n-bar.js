import React from "react";
import Notification from "../notification/notiftication";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import Rbtn from "@/components/interface/btn/r-btn";
import ExclamationTriangle from "@/components/design/icons/exclamation-triangle";
import LogOut from "@/components/design/icons/log-out";
import ApiService from "@/components/logic/ApiService";
import SwitchMagazin from "../switch-magazin/switch-magazin";

export default function Nbar() {
  // const Api = new ApiService("alert", undefined);
  // const router = useRouter();

  // const { mutate, isSuccess } = useMutation(() => Api.logout());

  // if (isLoading) {
  //   return <Loading />;
  // }
  // if (isSuccess) {
  //   router.reload();
  // }

  // const alert = useQuery("alert", () => Api.getAlert());

  return (
    <div
      style={{ fill: "#0066CC" }}
      className="flex items-center justify-end gap-3 p-4 "
    >
      <SwitchMagazin />
      {/* <Rbtn func={() => router.push("/alert")}>
        {/* <Notification num={10000} />  
        <Notification num={alert?.data?.data?.data} />
        <ExclamationTriangle />
      </Rbtn> */}
      <Rbtn func={() => mutate("")}>
        <LogOut />
      </Rbtn>
    </div>
  );
}
