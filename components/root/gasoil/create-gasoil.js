import SortieGasoilForm from "@/components/build/form/sortie-gasoil-form";
import MainBtn from "@/components/interface/btn/main-btn";
import ApiService from "@/components/logic/ApiService";
import { formatDate } from "@/components/logic/mini-func";
import { useStoresortieGasoil } from "@/components/state/useStoreGasoil";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";

const CreateGasoil = () => {
  const router = useRouter();
  const [gasoil, setGasoil] = useState({
    date: formatDate(Date.now()),
    BeneficiareId: "",
    Beneficiare: { name: "" },
    number: "",
  });
  const { sortieGasoil, initializeSortieGasoil } = useStoresortieGasoil(
    (state) => state
  );
  // initializeSortieGasoil({
  //   date: formatDate(Date.now()),
  //   BeneficiareId: "",
  //   Beneficiare: { name: "" },
  //   number: "",
  // }
  // })
  const Api = new ApiService("gasoilsortie", undefined);
  // MUTATION
  // ADD ENTREE
  const addGasoil = useMutation((data) => Api.create(data));
  // COUNTER
  const count = useMutation("Num of bon gasoil", (data) => Api.count(data));

  const beneficiareHandler = (...value) => {
    // console.log(value);
    if (typeof value[1] !== "number") {
      const obj = { ...gasoil };
      obj[value[0]] = value[1];
      obj[`${value[0]}Id`] = value[1].value;
      setGasoil({ ...obj });
    }
  };
  useEffect(() => {
    const obj = { ...gasoil };
    obj.date = formatDate(Date.now());
    setGasoil({ ...obj });
    count.mutate();
  }, []);
  useEffect(() => {
    if (count.isSuccess) {
      initializeSortieGasoil({
        date: formatDate(Date.now()),
        BeneficiareId: "",
        Beneficiare: { name: "" },
        number: count.data?.data?.data + 1,
      });
    }
  }, [count.isSuccess]);

  const onChange = (...data) => {
    // console.log(data,)
    const obj = { ...gasoil };
    obj.date = `${data[1]}`;
    setGasoil({ ...obj });
    count.mutate(`${data[1]}`.split("-")[0]);
  };
  // console.log(gasoil);
  if (addGasoil.isSuccess) {
    // console.log(addGasoil);
    router.push(`/gasoilsortie/${addGasoil.data.data.data.id}`);
  }
  return (
    <>
      <div className="h-[92vh] overflow-hidden w-full ">
        {/* DASHBOARD */}
        <div className="">
          <div className="flex justify-between items-center ">
            <div>
              <div className="text-2xl text-gray-400 uppercase">
                {`Sortie de gasoil numéro : ${
                  count.data ? sortieGasoil.number : ""
                }`}
              </div>
            </div>
          </div>
          {/* GASOIL FORM */}
          <div className="flex flex-col gap-2 items-end justify-start py-2">
            <SortieGasoilForm
              onChange={onChange}
              beneficiare={beneficiareHandler}
              state={gasoil}
            />
            {!!sortieGasoil.BeneficiareId && (
              <MainBtn
                func={() => {
                  addGasoil.mutate({ ...sortieGasoil, total_price: 0 });
                }}
              >
                Ajouter
              </MainBtn>
            )}
          </div>
          {/* END OF THE GASOIL FORM */}
        </div>
      </div>
    </>
  );
};

export default CreateGasoil;
