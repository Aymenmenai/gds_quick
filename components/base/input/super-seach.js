import * as React from "react";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import ApiService from "@/components/logic/ApiService";
import { useMutation, useQuery } from "react-query";

export default function SuperSearch({
  title ='add vehicule',
  route = 'vehicule',
  add = false,
  field,
  func,
  value = {
    name: "",
    id: "",
  },
  // WHEN I WANT TO ADD WITH ID
  extra = false,
  urlExtra = false,
  //
  optionKey = "name",
  // modifyOption = false,
}) {
  const [unknownValue, setUnknownValue] = useState("A");
  const [initialValue, setInitialValue] = useState(value);
  // const [urlMain, seturlMain] = useState(
  //   `?${unknownValue && `${optionKey}=${unknownValue}`}${
  //     urlExtra ? `${unknownValue && "&"}${urlExtra}` : ""
  //   }`
  // );
  const Api = new ApiService(route, undefined);

  // ENTREE START

  // IMPORT DATA
  // console.log(`?${optionKey}=${unknownValue}${urlExtra ? urlExtra : ""}`);
  // console.log(
  //   `?${unknownValue && `${optionKey}=${unknownValue}`}${
  //     urlExtra ? `${unknownValue && "&"}${urlExtra}` : ""
  //   }`
  // );
  const data = useQuery(`${route}s`, () => Api.superSeach(unknownValue));
  const mutation = useMutation((data) => Api.create(data));

  // SELECT NAME
  const selectData = (data) => {
    func(field, data?.id);
    func(`${field}`.replace("Id", ""), {
      [optionKey]: data?.[optionKey],
      value: data?.id,
    });
    setInitialValue(data);
  };
  // FATCH DATA AGAIN
  useEffect(() => {
    data.refetch();
    // seturlMain(
    //   `?${unknownValue && `${optionKey}=${unknownValue}`}${
    //     urlExtra ? `${unknownValue && "&"}${urlExtra}` : ""
    //   }`
    // );
  }, [mutation.isSuccess, unknownValue, urlExtra]);

  // SENT NEW VALUE
  useEffect(() => {
    if (unknownValue) {
      // If unknownValue is not empty, set initialValue to unknownValue
      setInitialValue({
        [optionKey]: value[optionKey] || unknownValue,
        id: "",
      });
    } else {
      // Otherwise, set initialValue to the provided value
      setInitialValue(value);
    }
    // Reset unknownValue after setting initialValue
    setUnknownValue("");
  }, [value]);

  const handleAddNew = () => {
    // console.log({name: unknownValue, ...extra})
    mutation.mutate({ [optionKey]: unknownValue, ...extra });
    data.refetch();
  };

  const options = data?.data?.data?.data?.data || [];

  const onChangeHandler = (value) => {
    setUnknownValue(value);
    if (value && value.onClick) {
      value.onClick();
      setUnknownValue("");
    }
  };

  if (data.isLoading) {
    return <>loading...</>;
  }

  // console.log(data?.data?.data?.data, "OPTION TEXT");
  // console.log(unknownValue,'OPTION TEXT');
  return (
    <div className=" w-full h-full">
      <Stack spacing={2}>
        <Autocomplete
          size="small"
          options={options}
          isOptionEqualToValue={(option, value) => {
            // console.log(option.id, value);
            return option.id === value.id;
          }}
          getOptionLabel={(option) => option[optionKey]}
          onChange={(event, value) => selectData(value)}
          value={initialValue}
          renderInput={(params) => (
            <TextField
              {...params}
              label={title}
              className="w-full rounded-xl"
              onChange={({ target }) =>
                onChangeHandler(target.value.toUpperCase())
              }
            />
          )}
          noOptionsText={
            <>
              {add ? (
                <span
                  className="cursor-pointer underline"
                  onClick={() => handleAddNew()}
                >
                  {"Ajouter une nouvelle option"}
                </span>
              ) : (
                <span className="cursor-not-allowed text-center text-gray-700">
                  {"vide"}
                </span>
              )}
            </>
          }
        />
      </Stack>
    </div>
  );
}
