import StandardInput from "@/components/base/input/standard-input";
import CircleLogo from "@/components/design/circle-logo";
import MainBtn from "@/components/interface/btn/main-btn";
import ApiService from "@/components/logic/ApiService";
import { TextField } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useMutation } from "react-query";
import Request from "../request/request";
import Logo from "@/components/design/logo";

export default function AuthForm() {
  const router = useRouter();
  const Api = new ApiService("user", undefined);
  const mutate = useMutation((data) => Api.login(data));
  const [data, setData] = useState({ name: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate.mutate(data);
  };

  if (mutate.isSuccess) {
    router.push("/entree/article");
  }

  return (
    <>
      <Request req={mutate} />
      <form 
        className="bg-gradient-to-tr from-white/30 to-transparent backdrop-blur-lg shadow flex flex-col gap-1 rounded-2xl px-4 py-7 border-white/25 border"
        onSubmit={handleSubmit}
      >
        <div className="bg-black/0 w-full flex justify-between items-center divide-x gap-2 p-2">
          <div className="flex-">
            <CircleLogo width={50} fill="#fff" />
          </div>
          <div className="text-white text-xl font-bold uppercase flex-1 pl-2 text-left">
            {"connectez-vous pour accéder"}
          </div>
          <div className="uppercase text-center text-2xl font-extrabold text-white"></div>
        </div>
        <div className="pt-10 flex flex-col gap-2">
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value.toLowerCase() })}
            placeholder="Le nom de l'utilisateur"
            className="p-2 border rounded"
          />

          <input
            type="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            placeholder="mot de passe"
            className="p-2 border rounded"
          />
        </div>
        {!mutate.isLoading && (
          <div className="flex items-center justify-between w-full pt-5">
            <button
              type="submit"
              className="border border-white text-white w-full py-2 rounded-xl text-center items-center justify-center flex font-bold uppercase cursor-pointer hover:bg-white/20 transition-all ease-in-out duration-200"
            >
              {"se connecter"}
            </button>
          </div>
        )}
      </form>
    </>
  );
}
