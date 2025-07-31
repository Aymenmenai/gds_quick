import StandardInput from "@/components/base/input/standard-input";
import StandardSelect from "@/components/base/input/standard-select";
import { useStoreVehicule } from "@/components/state/useVehiculeStore";
import React, { useEffect } from "react";

export default function VehiculeForm({ data = {} }) {
  // STATE
  const { vehicule, fillVehicule } = useStoreVehicule((state) => state);
  // DATA FOR IMPORT
  const dataInput = [
    { field: "name", title: "le nom de vehicule" },
    { field: "matricule", title: "Matricule" },
    { field: "serialCode", title: " Code de serie" },
  ];

  useEffect(() => {
    fillVehicule(data);
  }, []);

  // CHECK RESULT
  //console.log(vehicule, "vehicule");
  return (
    <div className="w-full grid grid-cols-2 justify-start gap-2 items-start">
      {dataInput.map((el, index) => {
        return (
          <StandardInput
            key={index}
            title={el.title}
            field={el.field}
            type={el.type}
            value={vehicule[el.field] || el.default}
            onChange={fillVehicule}
          />
        );
      })}
      <StandardSelect
        func={fillVehicule}
        value={{
          name: vehicule.VehiculeClient?.name || "",
          id: vehicule.VehiculeClientId || "",
        }}
        route={"vehiculeclient"}
        field={"VehiculeClientId"}
        title={"client"}
      />
      <StandardSelect
        func={fillVehicule}
        value={{
          name: vehicule.VehiculeType?.name || "",
          id: vehicule.VehiculeTypeId || "",
        }}
        route={"VehiculeType"}
        field={"VehiculeTypeId"}
        title={"type de vehicule"}
      />
    </div>
  );
}
