import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

export default function StandardInput({
  title,
  type = "text",
  field,
  placeholder,
  value = "",
  onChange,
  onClick = () => {},
  disabled = false,
  defaultValue = null,
}) {
  const [inputValue, setInputValue] = useState(defaultValue);

  const handleInputChange = (event) => {
    setInputValue(`${event.target.value}`.toUpperCase());
  };

  const handleFieldClick = () => {
    onClick();
    setInputValue(inputValue);
  };

  // useEffect(() => {
  //   setInputValue(value);
  // }, [!value]);

  useEffect(() => {
    onChange(field, inputValue);
  }, [inputValue]);

  // console.log(onChange, "34 STANDARD INPUT");
  return (
    <div className="flex-1">
      <TextField
        onDoubleClick={handleFieldClick}
        size="small"
        type={type}
        label={title}
        className="w-full input"
        onChange={handleInputChange}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  );
}
