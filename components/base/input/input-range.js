import React, { useState } from "react";
import InputSwitch from "./input-switch";

export default function InputRange({ onChange, field, cancel, value }) {
  const [percentage, setPercentage] = useState(0);

  const percentageHandler = (value) => {
    onChange(field, +value / 100);
    setPercentage(value);
  };

  return (
    <InputSwitch state={!value} cancelFunc={() => cancel(field)}>
      <input
        className="flex-1"
        title={"taxe"}
        defaultValue={0}
        type={"range"}
        max={100}
        onChange={({ target }) => {
          percentageHandler(target.value);
        }}
      />
      <div>{percentage}%</div>
    </InputSwitch>
  );
}
