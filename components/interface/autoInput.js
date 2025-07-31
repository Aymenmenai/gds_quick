import * as React from "react";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useEffect } from "react";

export default function AutoInput({ data, id, label, field, state, func }) {
  const [element, setElement] = useState({ id: id, field: field, data: [] });

  useEffect(() => {
    let arr = [...state];
    arr[id] = element;
    func(arr);
  }, [element]);

  // console.log('[AUTOINPUT]',element)
  return (
    <Stack spacing={2}>
      <Autocomplete
        multiple
        size="small"
        options={data}
        onChange={(event, value) => setElement({ ...element, data: value })}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    </Stack>
  );
}
