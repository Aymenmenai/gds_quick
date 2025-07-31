import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SelectUI({ label, func, options, index, condition }) {
  const [data, setData] = React.useState("");

  const handleChange = (event) => {
    setData(event.target.value);
    func(index, event.target.value);
  };

  // console.log(data,condition)
  return (
    <Box className={"flex-1"} sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          size="small"
          type
          required
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          defaultValue={condition ? null : data}
          value={condition ? null : data}
          // value={data}
          label={label}
          onChange={handleChange}
        >
          {options.map((option) => {
            return (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
