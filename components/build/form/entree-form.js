import StandardInput from "@/components/base/input/standard-input";
import StandardSelect from "@/components/base/input/standard-select";
import { formatDate } from "@/components/logic/mini-func";
import { useStoreEntree } from "@/components/state/useStoreEntree";
import React, { useEffect } from "react";

export default function EntreeForm({ data = {}, isNumber = false }) {
  // STATE
  const { entree, fillEntree } = useStoreEntree((state) => state);

  const n = {
    title: "Numero de bon",
    field: "number",
    type: "number",
    default: data.number,
  };
  const casual = [
    {
      title: "La date",
      field: "date",
      type: "date",
      default: formatDate(data?.date) || formatDate(Date.now()),
    },
    {
      title: "Facture",
      type: "text",
      field: "facture",
      default: data?.facture,
    },
    {
      title: "Bon de livraison",
      field: "bon_de_livraison",
      type: "text",
      default: data?.bon_de_livraison,
    },
  ];
  // DATA FOR IMPORT
  const dataInput = isNumber ? [n, ...casual] : casual;

  useEffect(() => {
    fillEntree(data);
  }, []);

  // CHECK RESULT
  // console.log(entree, "ENTREE");
  return (
    <div className="w-full grid grid-cols-2 justify-start gap-2 items-start">
      {dataInput.map((el, index) => {
        return (
          <StandardInput
            key={index}
            title={el.title}
            field={el.field}
            type={el.type}
            value={entree[el.field]}
            // defaultValue={entree[el.field] || el.default}
            onChange={fillEntree}
          />
        );
      })}

      <StandardSelect
        func={fillEntree}
        value={{
          name: entree.Fournisseur?.name || "",
          id: entree.FournisseurId || "",
        }}
        route={"fournisseur"}
        field={"FournisseurId"}
        title={"Fournisseur"}
        add={false}
      />
    </div>
  );
}
