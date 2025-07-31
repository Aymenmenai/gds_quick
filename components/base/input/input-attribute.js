import { useStoreAttributes } from "@/components/state/useStoreAttributes";
import { Cancel, Delete, InputTwoTone, Save } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useState } from "react";
import TextToInput from "./text-to-input";

export default function InputAttribute({ index: key, name, value }) {
  // GLOABL STATE
  const {
    attributes,
    fillAttribute,
    modifyAttributeName,
    modifyAttributeValue,
    deleteAttribute,
  } = useStoreAttributes((state) => state);
  // LOCAL STATE
  const [activated, setActivated] = useState(false);
  const defaultVal = {
    name: name,
    value: value,
  };

  // UPDATE STATE
  // NAME
  const update = (index, value) => {
    fillAttribute(key, index, value);
  };
  //   EDIT VALUE
  const modify = () => {
    modifyAttributeName(key, name);
    modifyAttributeValue(key, value);
    setActivated(false);
  };
  //   CANCEL
  const cancel = () => {
    modifyAttributeName(key, "");
    modifyAttributeValue(key, "");
    // setData({ name, value });
    setActivated(false);
  };
  // INPUT VALUE
  // console.log(data);
  return (
    <div className="flex gap-3">
      <TextToInput
        stateFunc={setActivated}
        state={activated}
        value={name}
        name={"Le nom"}
        field={"name"}
        type={"text"}
        onChange={update}
      />
      <TextToInput
        stateFunc={setActivated}
        state={activated}
        value={value}
        field={"value"}
        name={"Le value"}
        type={"text"}
        onChange={update}
      />
      {activated ? (
        <div className="flex">
          <IconButton onClick={cancel}>
            <Cancel />
          </IconButton>
          <IconButton onClick={modify}>
            <Save />
          </IconButton>
        </div>
      ) : (
        <IconButton onClick={() => deleteAttribute(key)}>
          <Delete />
        </IconButton>
      )}
    </div>
  );
}
