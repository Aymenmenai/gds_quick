import * as React from "react";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import axios from "axios";

export default function SingleAutoInput({
  url = "fournisseur",
  data,
  index,
  label,
  condition = false,
  func,
}) {
  const [element, setElement] = useState({ [index]: "" });
  const [unknownValue, setUnknownValue] = useState("");
  const [initialValue, setInitialValue] = useState({ name: null, id: null });

  const mutation = useMutation({
    mutationFn: (obj) => {
      return axios.post(`/api/v1/${url}/add`, { name: obj });
    },
  });
  // SELECT NAME
  const selectData = (data) => {
    setInitialValue(data);
    setElement({ [index]: data?.id || "" });
  };

  // FATCH DATA AGAIN
  useEffect(() => {
    data.refetch();
  }, [mutation.isSuccess]);

  // PUT ID IN NEW STATE
  useEffect(() => {
    if (element[index] !== "") {
      func(index, element[index]);
    }
  }, [element]);

  const handleAddNew = () => {
    mutation.mutate(unknownValue);
    data.refetch();
  };

  const options = data?.data?.data?.data;

  const onChangeHandler = (value) => {
    setUnknownValue(value);
    if (value && value.onClick) {
      value.onClick();
      setUnknownValue("");
    }
  };

  const getName = (id) => {
    let curr = "";
    options.forEach((element) => {
      if (element.id === id) curr = element;
    });
    // console.log(curr,'CURR!!!');
    return curr;
  };

  // console.log(condition[index], !condition);
  return (
    <Stack spacing={2}>
      <Autocomplete
        size="small"
        options={options}
        getOptionLabel={(option) => option.name}
        onChange={(event, value) => selectData(value)}
        defaultValue={condition[index]!==undefined ? getName(condition[index]) : { name: "" }}
        // value={condition ? null : initialValue}
        renderInput={(params) => {
          return (
            <TextField
              onChange={({ target }) => onChangeHandler(target.value)}
              {...params}
              label={label}
              // value={condition ? condition[index] : unknownValue}
            />
          );
        }}
        noOptionsText={
          <span
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => handleAddNew()}
          >
            {"Ajouter une nouvelle option"}
          </span>
        }
      />
    </Stack>
  );
}
