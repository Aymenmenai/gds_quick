import Input from "@/components/interface/input";
import SelectUI from "@/components/interface/select";
import SingleAutoInput from "@/components/interface/single-auto-input";
import { Slider, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";

const ArtcileAddForm = ({
  func,
  tags,
  brands,
  families,
  references,
  units,
  agreefunc,
}) => {
  const formRef = useRef(null);

  // SECTIONS
  const [ReferenceId, setReferenceId] = useState(false);
  const [sousF, setSousF] = useState(false);

  const [inputs, setInputs] = useState({});
  // DATA
  const sousFamilies = useQuery(
    "sousFamilies",
    () => {
      return axios.get(
        `/api/v1/sousFamily/option?${sousF ? `FamilyId=${sousF}` : ""}`
      );
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const RLreference = useQuery(
    "RLreference",
    () => {
      if (ReferenceId) {
        return axios.get(
          `/api/v1/reference/generate/${ReferenceId ? ReferenceId : ""}`
        );
      }
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  // FUNCTIONS
  const sousFHandler = (index, value) => {
    setSousF(value);
  };

  const setInput = (index, value) => {
    setInputs({ ...inputs, [index]: value });
  };

  // USE EFFECT
  useEffect(() => {
    sousFamilies.refetch();
  }, [sousF]);
  useEffect(() => {
    setReferenceId(inputs.RefId);
    func(inputs);
  }, [inputs]);
  useEffect(() => {
    RLreference.refetch();
  }, [inputs, ReferenceId]);

  // SET FORM
  const Submiting = (e) => {
    e.preventDefault();
    agreefunc();
    setInputs({});
    setSousF(false);

    // console.log(e.target[2].value);
    formRef.current.reset();
  };
  // console.log(inputs.RefId, "[INPUTS]");
  return (
    <>
      <form
        ref={formRef}
        onSubmit={(e) => Submiting(e)}
        className="grid grid-cols-2  gap-5 p-4"
      >
        <div className="col-span-2 flex justify-between items-center gap-5">
          <TextField
            ref={formRef}
            size="small"
            disabled
            className="bg-gray-300/60 flex-1  text-gray-700 overflow-hidden border-2 rounded-md border-gray-400"
            defaultValue={`${
              inputs.RefId
                ? RLreference?.data?.data?.data?.name
                : "Auto-generator"
            }`}
            value={`${
              inputs.RefId
                ? RLreference?.data?.data?.data?.name
                : "Auto-generator"
            }`}
          />
          <div className="text-xs text-gray-500 flex-1">
            {
              "ceci est une référence spéciale générée par l'application pour aider avec la référence compatible"
            }
          </div>
        </div>
        {/* REFERENCE / FAMILY / */}
        <div className=" flex justify-start items-center gap-3 flex-col">
          {/* REFERENCE */}
          <div className="w-full">
            <SingleAutoInput
              condition={!inputs.RefId}
              func={setInput}
              label={"Référence"}
              data={references}
              index={"RefId"}
              url={"ref"}
            />
          </div>
          {/* FAMILY */}
          <div className="w-full grid gap-3">
            <SelectUI
              condition={!sousF}
              func={sousFHandler}
              label={"Famille"}
              options={families}
              index={"FamilyId"}
            />

            <SelectUI
              condition={!inputs.SousFamilyId}
              func={setInput}
              label={"Sous-famille"}
              options={sousFamilies?.data?.data?.data}
              index={"SousFamilyId"}
            />
          </div>
        </div>
        <div className=" flex justify-start items-center gap-3 flex-col">
          <div className="w-full">
            <SingleAutoInput
              condition={!inputs.TagId}
              func={setInput}
              label={"Nom de la pièce"}
              data={tags}
              index={"TagId"}
              url={"tag"}
            />
          </div>

          <div className="w-full">
            <SingleAutoInput
              condition={!inputs.BrandId}
              func={setInput}
              label={"La marque"}
              data={brands}
              index={"BrandId"}
              url={"brand"}
            />
          </div>
          <div className="w-full">
            <SingleAutoInput
              condition={!inputs.UnitId}
              func={setInput}
              label={"Unité"}
              data={units}
              index={"UnitId"}
              url={"unit"}
            />
          </div>
        </div>

        <hr className="col-span-2" />
        <Input
          func={setInput}
          type="number"
          label={"Quantite"}
          index={"quantity"}
        />
        <Input func={setInput} type="number" label={"Prix"} index={"price"} />
        <Input func={setInput} type="date" label={"Date"} index={"date"} />
        {/* <Input
          func={setInput}
          type="text"
          label={"L'emplacement"}
          index={"place"}
        /> */}
        <hr className="col-span-2" />
        <div className="col-span-2">
          <div className="text-sm">Taxe</div>
          <div className="flex gap-3 justify-center items-center">
            <Slider
              defaultValue={0}
              value={!inputs.tax ? 0 : inputs.tax}
              onChange={({ target }) => setInput("tax", target.value)}
            />
            <div>{!inputs.tax ? <>0%</> : <>{inputs.tax}%</>}</div>
          </div>
        </div>
      </form>
    </>
  );
};

export default ArtcileAddForm;
