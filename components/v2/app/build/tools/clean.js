import { BrushCleaning } from "lucide-react";
import React from "react";

const Clean = ({ func }) => (
  <button onClick={func} className="btn-r fill-blue-500">
    <BrushCleaning strokeWidth={1.5} className="stroke-blue-500 w-6 h-6" />
  </button>
);

export default Clean;
