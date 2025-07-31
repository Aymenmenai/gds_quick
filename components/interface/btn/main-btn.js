import React from "react";

const MainBtn = ({ children, func = () => {} }) => {
  return (
    <div
      onClick={func}
      className="bg-blue-500 border-2 border-blue-500 hover:border-blue-700 cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      {children}
    </div>
  );
};

export default MainBtn;
