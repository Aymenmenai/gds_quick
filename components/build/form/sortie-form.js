import StandardInput from "@/components/base/input/standard-input";
import StandardSelect from "@/components/base/input/standard-select";
import SuperSearch from "@/components/base/input/super-seach";
import { formatDate } from "@/components/logic/mini-func";
import { useStoreSortie } from "@/components/state/useStoreSortie";
import React from "react";

export default function SortieForm({ data, isNumber = false }) {
  // STATE
  const { sortie, fillSortie } = useStoreSortie(
    (state) => state
  );
  // console.log(data, ";;;;;;;;;;;;");
  // DATA FOR IMPORT
  const n = {
    title: "Numero de bon",
    field: "number",
    type: "number",
    default: sortie["number"] || data?.number,
  }
  let casual = [
    {
      title: "La date",
      field: "date",
      type: "date",
      default: data ? formatDate(data.date) : formatDate(Date.now()),
    },
  ];

  const dataInput = isNumber ? [n, ...casual] : casual;


  // CHECK RESULT
  //console.log(sortie, "sortie");
  return (
    <div className="w-full grid grid-cols-2 justify-start gap-2 items-start">
      {dataInput.map((el, index) => {
        return (
          <StandardInput
            key={index}
            title={el.title}
            field={el.field}
            type={el.type}
            value={el.default}
            defaultValue={el.default}
            onChange={fillSortie}
          />
        );
      })}

      <StandardSelect
        func={fillSortie}
        value={{
          name: sortie.Beneficiare?.name || "",
          id: sortie.BeneficiareId || "",
        }}
        route={"beneficiare"}
        field={"BeneficiareId"}
        title={"Beneficiare"}
        add={false}
      />
      <SuperSearch
        func={fillSortie}
        value={{
          name: sortie.Vehicule?.name || "",
          id: sortie.Vehicule?.value || "",
        }}
        route={"vehicule"}
        field={"VehiculeId"}
        title={"Véhicule"}
        add={false}
      />
      {/* <StandardSelect
        modifyOption={"name"}
        // optionKey={"matricule"}
        func={fillSortie}
        value={{
          name: sortie.VehiculeType?.name || "",
          id: sortie.VehiculeType?.value || "",
        }}
        route={"vehiculeType"}
        field={"VehiculeTypeId"}
        title={"Véhicule marque"}
        add={false}
      /> */}
    </div>
  );
}
