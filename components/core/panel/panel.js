import AutoInput from "@/components/interface/autoInput";
import { Box, Button, Divider, Drawer, IconButton } from "@mui/material";

import React, { useState } from "react";
import { FilterList } from "@mui/icons-material";
import RangeSlider from "@/components/interface/range-slider";
import DateRange from "@/components/interface/date-range";
import { Urlgenerator } from "./generateUrl";

const Panel = ({
  root = "article",
  func = () => {
    0;
  },
  obj,
}) => {
  // BRING TOTAL DATA
  const [time, setTime] = useState({ start: null, end: null });
  const [select, setSelect] = useState(
    obj.select ? [...Array(obj.select.length).keys()] : false
  );
  const [range, setRange] = useState(
    obj.range ? [...Array(obj.range.length).keys()] : false
  );

  const [state, setState] = useState({
    right: false,
  });

  const url = Urlgenerator(root, { time, select, range });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => {
    // AGREE FUNC
    const agreeFunc = () => {
      func(url);
      toggleDrawer(anchor, false);
    };
    return (
      <Box
        sx={{ width: 400, padding: "1rem", display: "grid", gap: "1rem" }}
        role="presentation"
      >
        {obj.removeTime ? <></> : <DateRange func={setTime} />}
        <Divider />
        {obj.select ? (
          <>
            <div style={{ display: "grid", gap: "1rem" }}>
              {obj.select.map((el, index) => {
                return (
                  <AutoInput
                    id={index}
                    field={el.field}
                    label={el.title}
                    data={el.data}
                    key={obj.select.indexOf(el)}
                    func={setSelect}
                    state={select}
                  />
                );
              })}
              <Divider />
            </div>
          </>
        ) : (
          <></>
        )}
        {obj.range ? (
          obj.range.map((el, index) => {
            return (
              <RangeSlider
                key={index}
                id={index}
                field={el.field}
                func={setRange}
                max={el.max}
                min={el.min}
                label={el.title}
                state={range}
              />
            );
          })
        ) : (
          <></>
        )}

        <div className="flex flex-col gap-3 absolute bottom-0 left-0 w-full p-3 bg-white">
          <Button
            onClick={agreeFunc}
            style={{ background: "blue" }}
            color="success"
            variant="contained"
          >
            OK
          </Button>

          <Button onClick={toggleDrawer(anchor, false)}>Cancel</Button>
        </div>
      </Box>
    );
  };

  // VALUE RETURNED
  // console.log(range);
  // const url = Urlgenerator(root,{ time, select, range })
  // SET NEW URL

  return (
    <div style={{ float: "right" }}>
      <IconButton onClick={toggleDrawer("right", true)}>
        <FilterList />
      </IconButton>
      <Drawer
        anchor={"right"}
        open={state["right"]}
        onClose={toggleDrawer("right", false)}
      >
        {list("right")}
      </Drawer>
    </div>
  );
};

export default Panel;
