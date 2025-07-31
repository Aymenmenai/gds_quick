import Loading from "@/components/interface/loading/loading";
import Responsebar from "@/components/interface/responsebar/responsebar";
import React from "react";

export default function Request({ req }) {
  // console.log(req);
  // if (req.isLoading) {
  //   return <Loading />;
  // }
  if (!req.data) {
    return <Responsebar isError={true} />;
  }
  return <Responsebar />;
}
