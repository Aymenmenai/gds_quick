import Toggle from "@/components/base/toggle/toggle";
import React, { useEffect } from "react";
import { useState } from "react";

export default function InputSwitch({ state, children, cancelFunc }) {
  const [activate, setActivate] = useState(false);
  const [initail, setInitail] = useState(false);

  useEffect(() => {
    setInitail(true);
    if (state) {
      setActivate(false);
    }
  }, [!state]);

  useEffect(() => {
    if (!activate && initail) {
      cancelFunc();
    }
  }, [activate]);

  return (
    <div className="flex gap-2 justify-start items-center">
      <Toggle func={setActivate} state={activate} />
      {activate ? <>{children}</> : <></>}
    </div>
  );
}
