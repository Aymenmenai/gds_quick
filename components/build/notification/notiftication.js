import React from "react";

export default function Notification({ num }) {
  return (
    <div className="text-[9px] top-0 -left-1 font-bold  bg-red-600  rounded-full absolute">
      <div className="py-0.5 px-1.5 text-white">{num}</div>
    </div>
  );
}
