import StandardInput from "@/components/base/input/standard-input";
import React, { useState } from "react";
import InputSwitch from "./input-switch";
import { formatDate } from "@/components/logic/mini-func";

export default function InputExpired({ value, onChange, field, cancel }) {
  const expiredDate = formatDate(Date.now() + 90 * 24 * 3600 * 1000);

  return (
    <InputSwitch state={!value} cancelFunc={() => cancel(field)}>
      <StandardInput
        title="Date expired"
        type="date"
        field={field}
        placeholder="Redesigned Text Field"
        value={value || expiredDate}
        onChange={onChange}
      />
    </InputSwitch>
  );
}
