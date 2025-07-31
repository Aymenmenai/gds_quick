import { Box, Divider, Drawer, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FilterList } from "@mui/icons-material";
import InputTime from "@/components/base/input/input-time";
// import { useStoreFilter } from "@/components/state/useStoreFilter";
import { dataForFilter } from "@/components/logic/mini-func";
import StandardSelect from "@/components/base/input/standard-select";
import MainBtn from "@/components/interface/btn/main-btn";

// Get tomorrow's date
const getTomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
};

const List = ({ panelFilter = [], closeDrawer, submitFilter, state }) => {
  // ANY FILTER
  /*
    YOU ACCEPT THE CONTAINTER LIKE THIS 
    { NAME : NAME OF THE FIELDS , VALUE : VALUE OF THE FIELDS}
  */
  const init_el = []
  panelFilter.map((el) => { init_el.push({ name: el.field, value: undefined }) })
  // console.log(init_el, 'start')
  const [elements, setElements] = useState(init_el);

  /* 
    THIS FUNCTION MUSTLY ABOUT TIME 
    LATER INTEGRATE THE PRICE
  */
  const [gte, setGte] = useState("2022-01-01");
  const [lte, setLte] = useState(getTomorrow());


  // START THE ELEMENT SECTION 
  // useEffect(() => {
  //   ;
  // }, []);

  const setNewValue = (field, value) => {
    let newElements = [...elements];
    newElements.map(el => {
      if (el.name === field) {
        el.value = value
      }
    })
    // filter.modifyFilterValue(field, value?.value || "");
    setElements(newElements);
  };

  const handleFilterClick = () => {
    let newurl = state;
    const withValue = elements.filter(a => a.value !== undefined)

    // console.log(withValue)
    // if (!newurl.includes("?")) {
    //   s =
    // }
    if (!!withValue.length) {
      let s = ''

      withValue.forEach(el => {
        s = s + '&' + `${el.name}=${el.value}`
      });
      newurl = newurl + s
    }

    if (gte) {
      let s = ''
      s = s + "&date[gte]=" + gte
      newurl += s
    }
    if (lte) {
      let s = ''
      s = s + "&date[lte]=" + lte
      newurl += s
    }
    // if(newurl.)

    // Update filter values with gte and lte
    // filter.modifyFilterValue("date[gte]", gte);
    // filter.modifyFilterValue("date[lte]", lte);

    // Call the function to submit the filter
    submitFilter(newurl);

    // Close the drawer
    closeDrawer();
  };


  return (
    <Box
      sx={{ width: 400, padding: "1rem", display: "grid", gap: "1rem" }}
      role="presentation"
    >
      <InputTime
        value={gte}
        label={"Depuis"}
        func={(value) => setGte(dataForFilter(value))}
      />
      <InputTime
        value={lte}
        label={"Jusqu'a"}
        func={(value) => setLte(dataForFilter(value))}
      />

      <Divider />
      {panelFilter.map((el, index) => (
        <StandardSelect
          key={index}
          title={el.name}
          route={el.root}
          field={el.field}
          func={(field, value) => setNewValue(field, value)}
          add={false}
        />
      ))}

      <Divider />
      <MainBtn func={handleFilterClick}>Filter</MainBtn>
    </Box>
  );
};

const Panel = ({ root = "article", panelFilter = [], panelSlider = [], func, url }) => {
  const [state, setState] = useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    
    setState({ ...state, [anchor]: open });
  };

  const closeDrawer = () => setState({ right: false });

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
        <List
          panelSlider={panelSlider}
          panelFilter={panelFilter}
          closeDrawer={closeDrawer}
          submitFilter={func}
          state={url}
          anchor={"right"}
        />
      </Drawer>
    </div>
  );
};

export default Panel;
