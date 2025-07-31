import React from "react";
import StandardInput from "./standard-input";

export default function TextToInput({
  state,
  stateFunc,
  value,
  name,
  type,
  field,
  onChange,
}) {
  return (
    <>
      {!state ? (
        <div
          onDoubleClick={() => stateFunc(true)}
          className="h-full border-dotted border-2 border-cyan-500 rounded-lg flex justify-center items-center flex-1"
        >
          {value}
        </div>
      ) : (
        <StandardInput
          title={name}
          type={type}
          field={field}
          value={value}
          onChange={onChange}
          defaultValue={value}
        />
      )}
    </>
  );
}
