import StandardInput from "@/components/base/input/standard-input";
import StandardSelect from "@/components/base/input/standard-select";
import { formatDate } from "@/components/logic/mini-func";
import { useStoresortieGasoil } from "@/components/state/useStoreGasoil";
import React, { useState } from "react";

const SortieGasoilForm = ({ onChange, beneficiare, data ,modify_number=false}) => {
  // STATE
  const { sortieGasoil, fillSortieGasoil, cancelElement } =
    useStoresortieGasoil((state) => state);
  // console.log(sortieGasoil, ";;;;;;;;;;;;");
  // DATA FOR IMPORT
  let dataInput = modify_number ? [        { title: "Numero", field: "number", type: "number",default:sortieGasoil.number },{
      title: "La date",
      field: "date",
      type: "date",
      default: data ? formatDate(data.date) : formatDate(Date.now()),
    }
] : [

    {
      title: "La date",
      field: "date",
      type: "date",
      default: data ? formatDate(data.date) : formatDate(Date.now()),
    },
  ];

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
            value={sortieGasoil[el.field] || el.default}
            defaultValue={el.default}
            onChange={fillSortieGasoil}
          />
        );
      })}

      <StandardSelect
        func={fillSortieGasoil}
        value={{
          name: sortieGasoil.Beneficiare?.name || "",
          id: sortieGasoil.BeneficiareId || "",
        }}
        route={"beneficiare"}
        field={"BeneficiareId"}
        title={"Beneficiare"}
      />
    </div>
  );
};

export default SortieGasoilForm;
