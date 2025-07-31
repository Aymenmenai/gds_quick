import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useEffect } from "react";

export default function RangeSlider({
  max,
  min,
  label,
  id,
  field,
  func,
  state,
}) {
  const [value, setValue] = React.useState({field,min, max});

  // console.log(id,state)
  const handleChange = (event, newValue) => {
    let range = {};
    range.min = newValue[0];
    range.max = newValue[1];
    range.field = field;
    // console.log(range,'-----')
    setValue(range);
    // func(range);
  };

  useEffect(() => {
    //   setTimeout(() => {
    let arr = [...state];
    // //     // let arr = [...state];
    arr[id] = {...value};
    // console.log(arr);
    func(arr);
    //   }, 1000);
  }, [value]);

  return (
    <Box sx={{ width: 370 }}>
      <div>{label}</div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {min}
        </div>
        <Slider
          style={{ flex: 4 }}
          getAriaLabel={() => "Temperature range"}
          value={[value.min,value.max]}
          min={min}
          max={max}
          onChange={handleChange}
          valueLabelDisplay="auto"
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {max}
        </div>
      </div>
    </Box>
  );
}
