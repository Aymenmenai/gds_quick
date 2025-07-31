import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useState } from "react";

export default function InputTime({ func, label, value }) {
  const [date, setdate] = useState(value)

  const dateHandler = (value) => {
    setdate(value)
    func(new Date(value).getTime())
  }
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={date}
          label={label}
          onChange={(value) => dateHandler(value)}
          renderInput={(params) => <TextField size="small" {...params} />}
        />
      </LocalizationProvider>
    </>
  );
}
