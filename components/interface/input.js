import { TextField } from "@mui/material";
import React from "react";

const Input = ({ type = "text", label = "Empty", index, func ,initialValue}) => {
  return (
    <TextField
      className="flex-1"
      size="small"
      required
      label={label}
      type={type}
      defaultValue={initialValue}
      // value={initialValue}
      onChange={({ target }) => func(index, target.value)}
    />
  );
};

export default Input;
