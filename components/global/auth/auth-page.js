import Logo from "@/components/design/logo";
import React from "react";
import coverImage from "@/public/stock.jpg";
import Image from "next/image";
import AuthForm from "@/components/build/form/auth-from";
import CircleLogo from "@/components/design/circle-logo";
import StandardView from "@/components/build/form/standard-View";

const AuthPage = () => {
  return (
    <>
      <div className=" bg-gradient-to-tr from-blue-500 to-[#0066CC] overflow-hidden w-screen h-screen absolute left-0 top-0 z-10 flex justify-start items-center flex-col">
        <div className=" fill-white  flex justify-center items-center p-12 gap-3">
          <CircleLogo width={90} />
          <div className="uppercase text-4xl text-white font-bold">
            {"Gestion de stock"}
          </div>
         
        </div>
        <Image
          src={coverImage}
          alt="Cover Image"
          className="fixed -z-10 blur-sm opacity-60 w-full h-full"
        />
        <div className="w-96 transition-all ease-in-out duration-300">
          <AuthForm />
        </div>
        <div className=" w-full bg-gradient-to-t from-gray-900 to-transparent  fixed bottom-0 py-4 text-white flex justify-center items-center gap-4 divide-x-2">
          <div className="font-bold text-lg uppercase text-right pl-4">
            {"think logistic"}
            <br />
            {"think us"}
          </div>
          <div className="pl-4">
            <Logo fill="#fff" width={150} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
