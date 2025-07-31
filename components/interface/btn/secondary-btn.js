import React from "react";

const SecondaryBtn = ({ children, func }) => {
  return (
    <div
      onClick={func}
      className="text-blue-500 cursor-pointer border-blue-500 border-2  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      {children}
    </div>
  );
};

export default SecondaryBtn;
