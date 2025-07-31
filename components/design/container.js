import { ArrowBack, Edit, Print } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";

const Container = ({ func, children, form }) => {
  // console.log(func.asPath.split('/'))
  return (
    <>
      <div className="px-2 flex items-center justify-between">
        <IconButton onClick={func.back}>
          <ArrowBack />
        </IconButton>
        <div className="flex justify-center items-center ">
          {form}
          <IconButton
            onClick={() =>
              func.push(
                `/${func.asPath.split("/")[1]}/pdf/${func.asPath.split("/")[2]}`
              )
            }
          >
            <Print />
          </IconButton>
        </div>
      </div>
      <div>{children}</div>
    </>
  );
};

export default Container;
