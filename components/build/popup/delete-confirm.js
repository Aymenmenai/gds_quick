import StandardDialog from "@/components/base/dialog/standard-dialog";
import MainBtn from "@/components/interface/btn/main-btn";
import React, { useState } from "react";

export default function DeleteConfirmation({ btn, func }) {
  const [close, setClose] = useState(true);
  const mainFunc = () => {
    func();
    setClose(false);
  };
  return (
    <StandardDialog state={close} btn={btn} title={"Supprimer cet élément"}>
      <div className="w-[30vw] flex justify-center items-center p-3 pt-0">
        <div className="text-gray-800">
          {
            "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible et la suppression sera permanente."
          }
        </div>
      </div>
      <div className="col-span-full  flex gap-2 justify-end items-center ">
        <MainBtn func={mainFunc}>{"Confirmer la suppression"}</MainBtn>
      </div>
    </StandardDialog>
  );
}
