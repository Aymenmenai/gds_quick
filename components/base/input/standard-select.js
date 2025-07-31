import * as React from "react";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import ApiService from "@/components/logic/ApiService";
import { useMutation, useQuery } from "react-query";

export default function StandardSelect({
  value = false,
  title,
  route,
  add = true,
  field,
  func,
  extra = false,
  urlExtra = false,
  //
  optionKey = "name",
  // modifyOption = false,
}) {
  // console.log(value.name, 'SELECT')
  const iniVal = !!value.name
    ? { name: value.name, id: value.id }
    : {
        name: "",
        id: "",
      };

  const [unknownValue, setUnknownValue] = useState("");
  const [initialValue, setInitialValue] = useState(iniVal);
  const [urlMain, seturlMain] = useState(
    `?${unknownValue && `${optionKey}=${unknownValue}`}${
      urlExtra ? `${unknownValue && "&"}${urlExtra}` : ""
    }`
  );
  const Api = new ApiService(route, undefined);

  // ENTREE START

  // IMPORT DATA
  // // console.log(`?${optionKey}=${unknownValue}${urlExtra ? urlExtra : ""}`);
  // console.log(
  //   `?${unknownValue && `${optionKey}=${unknownValue}`}${
  //     urlExtra ? `${unknownValue && "&"}${urlExtra}` : ""
  //   }`
  // );
  const data = useQuery(`${route}s`, () => Api.getMany(urlMain));
  const mutation = useMutation((data) => Api.create(data));

  // SELECT NAME
  const selectData = (data) => {
    func(field, data?.id);
    // func(`${field}`.replace("Id", ""), {
    //   [optionKey]: data?.[optionKey],
    //   value: data?.id,
    // });
    setInitialValue(data);
  };
  // FATCH DATA AGAIN
  useEffect(() => {
    data.refetch();
    if (unknownValue.length > 0) {
      seturlMain(
        `?${unknownValue && `${optionKey}=${unknownValue}`}${
          urlExtra ? `${unknownValue && "&"}${urlExtra}` : ""
        }`
      );
    } else {
      seturlMain(`?${urlExtra ? `${unknownValue && "&"}${urlExtra}` : ""}`);
    }
  }, [mutation.isSuccess, unknownValue, urlExtra]);

  const handleAddNew = () => {
    // console.log({name: unknownValue, ...extra})
    mutation.mutate({ [optionKey]: unknownValue, ...extra });
    data.refetch();
  };

  const options = data?.data?.data?.data?.data || [];

  const onChangeHandler = (V) => {
    // console.log(V, 'MAGAZING I hope')
    setUnknownValue(V);
    if (V && V.onClick) {
      V.onClick();
      setUnknownValue("");
    }
  };

  if (data.isLoading) {
    return <>loading...</>;
  }

  console.log(data?.data?.data?.data, "OPTION TEXT");
  // console.log(unknownValue,'OPTION TEXT');
  // console.log(iniVal.name, "algeria");
  return (
    <div className=" w-full h-full">
      <Stack spacing={2}>
        <Autocomplete
          size="small"
          options={options}
          isOptionEqualToValue={(option, v) => {
            // console.log(option.id, value);
            return option.id === initialValue.id;
          }}
          getOptionLabel={(option) => option[optionKey]}
          onChange={(event, v) => selectData(v)}
          defaultValue={iniVal}
          // value={initialValue}
          renderInput={(params) => (
            <TextField
              {...params}
              label={title}
              className="w-full rounded-xl input"
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
