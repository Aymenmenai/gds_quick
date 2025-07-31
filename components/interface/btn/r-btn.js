import React from "react";

export default function Rbtn({ children, func }) {
  return (
    <div
      onClick={() => {
        func();
      }}
      className="relative cursor-pointer hover:bg-[#3535350d]  w-9 h-9 rounded-full flex  justify-center items-center"
    >
      {children}
    </div>
  );
}
