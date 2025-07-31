import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import ApiService from "@/components/logic/ApiService";
import { useQueries, useQuery } from "react-query";
import { useEffect } from "react";
import StandardInput from "./standard-input";

function valuetext(value) {
  return `${value}°C`;
}

export default function InputSlider({ root, field, func }) {
  const Api = new ApiService(root);

  const data = useQuery(`${root}/maxmin`, () => Api.getMaxMin(field));

  const [value, setValue] = React.useState([20, 37]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setValue([data?.data?.data?.data.min, data?.data?.data?.data.max]);
  }, [data?.data?.data?.data]);
  useEffect(() => {
    func(value);
  }, [value]);
  //   console.log(data?.data?.data?.data,'HELLO');

  // GET MAX VALUE
  return (
    <div className="flex gap-5 justify-center items-center">
      <StandardInput
        type="number"
        onChange={() => {}}
        defaultValue={value[0]}
      />
      <Slider
        max={data?.data?.data?.data.max}
        min={data?.data?.data?.data.min}
        getAriaLabel={() => "Temperature range"}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
      />
      <StandardInput
        type="number"
        onChange={() => {}}
        defaultValue={value[1]}
      />
    </div>
  );
}
