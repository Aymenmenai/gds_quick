import { RefreshCcw } from "lucide-react";
import React from "react";

const Refetch = ({ func }) => {
  return (
    <button onClick={func} className="btn-r  ">
      <RefreshCcw strokeWidth={1.5} className="stroke-blue-500 w-6 h-6" />
    </button>
  );
};

export default Refetch;
