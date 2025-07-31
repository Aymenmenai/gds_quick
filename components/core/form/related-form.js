import BaseStandard from "@/components/root/base-standard";
import React, { useState } from "react";
import Input from "@/components/interface/input";
import ResUpdate from "@/components/interface/res/res-update";

const RelatedForm = ({
  position = false,
  id,
  initialValue,
  main = "reference",
  second = "ref",
  refetch,
  index = "ReferenceId",
}) => {
  const [input, setInput] = useState({
    [`${!position ? "alert" : "name"}`]: initialValue,
  });
  const setValue = (index, value) => {
    setInput({ [index]: `${value}`.toUpperCase() });
  };
  // AUTO CREATE
  // CREATE A LIST OF

  // ALERT
  // console.log(id, main, input, index);
  return (
    <div className="p-3 grid gap-3">
      <div className="bg-gray-800 w-full h-[2px] flex items-center px-3 ">
        <div className="text-xl bg-white px-2">{`Modify ${
          !position ? "l'alerte" : "le nom"
        }`}</div>
      </div>
      <div className="pt-1 flex justify-between items-center">
        {position ? (
          <>
            <div className="flex gap-2 w-full">
              <Input
                type={"name"}
                label="Nom"
                index={"name"}
                func={setValue}
                initialValue={input.initialValue}
              />
              <ResUpdate id={id} url={main} data={input} refetch={refetch} />
            </div>
          </>
        ) : (
          <div className="grid gap-2 w-full">
            <div className="flex gap-2 w-full">
              <Input
                type={"name"}
                label="Nom"
                index={"name"}
                func={setValue}
                initialValue={input.initialValue}
              />
              <ResUpdate id={id} url={main} data={input} refetch={refetch} />
            </div>

            <div className="flex gap-2 w-full">
              <Input
                type={"number"}
                label="Alerte"
                index={"alert"}
                func={setValue}
                initialValue={input.initialValue}
              />
              <ResUpdate id={id} url={main} data={input} refetch={refetch} />
            </div>
          </div>
        )}
      </div>
      <div className="py-4">
        <div className="bg-gray-400 w-full h-[2px] flex items-center px-3 ">
          <div className="text-xl bg-white px-2">
            Ajouter un nouveau Article
          </div>
        </div>
      </div>
      <BaseStandard main={second} extraData={{ [index]: id }} />
    </div>
  );
};

export default RelatedForm;
