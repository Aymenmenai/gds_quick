import { Checkbox, IconButton, TableCell, TableRow } from "@mui/material";
import React, { useEffect } from "react";

import { currencyFormatter } from "../../func/currencyFormatter";
import { useState } from "react";

import DialogUI from "@/components/interface/dialog";
import { Visibility } from "@mui/icons-material";

import { getBrand, getRef, getTag } from "../../requests/requests";
import Loading from "@/components/interface/loading/loading";
import Res from "@/components/interface/res/res";

const MiniRow = ({ id, rows, func = () => {} }) => {
  const [arr, setArr] = useState([]);
  const [dataInput, setDataInput] = useState([]);

  // TAG
  const tags = getTag();
  const references = getRef();
  const brands = getBrand();

  // CHECK IF ELEMENT
  const mainFunc = (e) => {
    let newArr = [...arr];
    if (!arr.includes(e)) {
      newArr.push(e);
    } else {
      newArr = [];
      arr.forEach((el) => {
        if (e !== el) {
          newArr.push(el);
        }
      });
    }
    // console.log(newArr);
    setArr(newArr);
  };

  useEffect(() => {
    let Arr = [];
    arr.forEach((el) => {
      Arr.push({ ArticleId: el, quantity: 0, SortieId: id });
    });

    setDataInput(Arr);
  }, [arr]);
  useEffect(() => {
    func(dataInput);
  }, [dataInput]);

  if (references.isLoading) return <Loading />;
  if (brands.isLoading) return <Loading />;
  if (tags.isLoading) return <Loading />;

//   console.log("UPDATE", dataInput, arr);
  return (
    <>
      {/* <Button onClick={sortieHandler}>ADD</Button> */}

      {rows.map((row) => {
        return (
          <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                // checked={ids.includes(row)}
                onClick={() => mainFunc(row.id)}
                // value={{...row}}
              />
            </TableCell>

            <TableCell align="right">{row?.Ref?.name}</TableCell>
            <TableCell align="right">
              {row?.Brand?.name} {row?.Tag?.name}
            </TableCell>
            <TableCell align="right">
              {currencyFormatter.format(row?.price).replace("DZD","DA").trim()}
            </TableCell>
            <TableCell align="right">{row?.quantity}</TableCell>
            <TableCell align="right">{row?.Unit?.name}</TableCell>

            <TableCell>
              <div className="flex justify-center items-center gap-3">
                <DialogUI
                  //   func={articleEditHandler}
                  text={"SEE la désignation"}
                  icon={
                    <IconButton>
                      <Visibility />
                    </IconButton>
                  }
                  //   button={
                  //     updateFunc ? (
                  //       <Res
                  //         refetch={refetch}
                  //         url={"articleqs"}
                  //         data={dataInput}
                  //         id={row.id}
                  //       />
                  //     ) : (
                  //       updateFunc
                  //     )
                  //   }
                >
                  SEE DETAILS
                </DialogUI>
              </div>
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
};

export default MiniRow;
