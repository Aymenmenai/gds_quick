import React from "react";
import Logo from "@/components/v2/design/svg/logo";

const Loading = () => {
  return (
    <div className="size-full flex-1 flex justify-center items-center flex-col bg-blue-100/50">
      <div className="w-20 fill-[#1e40af]">
        <Logo />
      </div>
      <div className="grid">
        <div className="text-[#1e40af] text-lg">
          Veuillez patienter un instant...
        </div>
        <div className="flex reverse-flex bg-[#1e40af]/10 w-full h-1 rounded-full overflow-hidden">
          <div className="progress bg-[#1e40af] w-1/2 h-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
