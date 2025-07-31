import * as React from "react";

import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function BasicDatePicker({func}) {
  const [start, setStart] = React.useState(null);
  const [end, setEnd] = React.useState(null);
  React.useEffect(() => {
    let date ={start:'',end:''}
    date.start = start != null ? new Date(start.$d).getTime() : null;
    date.end = end != null ? new Date(end.$d).getTime() : null;
    func(date);
  }, [start, end]);
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Depuis"
          value={start}
          onChange={(newValue) => {
            setStart(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Jusqu'a"
          value={end}
          onChange={(newValue) => {
            setEnd(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </>
  );
}
