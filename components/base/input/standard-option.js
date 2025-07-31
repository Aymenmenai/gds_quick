import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import React, {  useState } from "react";

function StandardOption({ option, onChange }) {
  const [selectedOption, setSelectedOption] = useState(option[0]?.field); // Renamed age to selectedOption

  const handleChange = (event) => {
    // console.log(event.target.value);
    setSelectedOption(event.target.value); // Renamed age to selectedOption
    onChange(event.target.value);
  };

  return (
    <FormControl className="w-44 flex justify-center itemcenter relative">
      <InputLabel size="small" className="absolute">
        OPTIONS
      </InputLabel>
      <Select
        className="w-full flex-1"
        size="small"
        defaultValue={selectedOption?.name ?? option[0]?.field}
        value={selectedOption}
        label="OPTIONS"
        onChange={handleChange}
      >
        {option.map((el, index) => {
          return (
            <MenuItem key={index} value={el.field}>
              {el.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

export default StandardOption;
