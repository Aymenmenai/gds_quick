import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

const StandardForm = ({ func, name = "name", initialValue = "" }) => {
  const [inputs, setInputs] = useState({});

  const setInput = (index, value) => {
    
    setInputs((prevInputs) => ({
      ...prevInputs,
      [index]: value.toUpperCase(),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    func(inputs);
  };

  useEffect(() => {
    func(inputs);
    // console.log(inputs)
  }, [func, inputs]);

  return (
    <form onSubmit={handleSubmit} className="grid gap-2 w-full">
      <TextField
        size="small"
        required
        label="Le nom"
        defaultValue={initialValue}
        onChange={(e) => setInput(name, e.target.value)}
      />
    </form>
  );
};

export default StandardForm;
