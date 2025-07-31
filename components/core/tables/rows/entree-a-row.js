import { Checkbox, IconButton, TableCell, TableRow } from "@mui/material";
import React, { useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";

import { currencyFormatter } from "../../func/currencyFormatter";
import renderDate from "../../func/date-render";
import { useState } from "react";
import useStoreIds from "../../store/store";
import ResDelete from "@/components/interface/res/res-delete";
import DialogUI from "@/components/interface/dialog";
import { Delete } from "@mui/icons-material";
import ResUpdate from "@/components/interface/res/res-update";

import {
  getBrand,
  getFamily,
  getFournisseur,
  getRef,
  getTag,
  getsousFamily,
} from "../../requests/requests";
import { useQuery } from "react-query";
import axios from "axios";
import Loading from "@/components/interface/loading/loading";
import EntreeAEditForm from "../../form/entree-a-edit-form";

const EntreeARow = ({
  rows,
  func = () => {},
  refetch = () => {},
  updateFunc = false,
}) => {
  const stateChanger = useStoreIds((state) => state.selectedArr);
  const ids = useStoreIds((state) => state.ids);
  const [arr, setArr] = useState([...ids]);
  const [dataInput, setDataInput] = useState({});

  // TAG
  const tags = getTag();
  const references = getRef();
  const fournisseurs = getFournisseur();
  const brands = getBrand();
  const sousFamiles = getsousFamily();
  const families = getFamily();
  const units = useQuery("units", () => {
    return axios.get("/api/v1/unit/option");
  });

  // CHECK IF ELEMENT
  const mainFunc = (e) => {
    // console.log(e)
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
    setArr(newArr);
  };

  // ARTICLE EDIT
  const articleEditHandler = (id, article) => {
    // const obj = { ...dataInput };
    // obj.articles[id] = { ...obj.articles[id], ...article };
    // setDataInput(obj);
  };

  useEffect(() => {
    stateChanger(arr);
  }, [arr]);

  if (families.isLoading) return <Loading />;
  if (references.isLoading) return <Loading />;
  if (fournisseurs.isLoading) return <Loading />;
  if (brands.isLoading) return <Loading />;
  if (tags.isLoading) return <Loading />;
  if (sousFamiles.isLoading) return <Loading />;
  if (units.isLoading) return <Loading />;

  // console.log("UPDATE", updateFunc);
  return (
    <>
      {/* <Button onClick={sortieHandler}>ADD</Button> */}

      {rows.map((row) => {
        return (
          <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
            <TableCell align="right">{row?.Ref?.name}</TableCell>
            <TableCell align="right">
              {row?.Brand?.name} {row?.Tag?.name}
            </TableCell>
            <TableCell align="right">{renderDate(row?.date)}</TableCell>
            <TableCell align="right">
              {currencyFormatter.format(row?.price).replace("DZD","DA").trim()}
            </TableCell>
            <TableCell align="right">{row?.initial_quantity}</TableCell>
            <TableCell align="right">{row?.SousFamily?.name}</TableCell>
            <TableCell align="right">{row?.Unit?.name}</TableCell>
            <TableCell align="right">
              {row?.Entree?.Fournisseur?.name}
            </TableCell>
            <TableCell>
              <div className="flex justify-center items-center gap-3">
                <DialogUI
                  func={articleEditHandler}
                  text={"Modifier la désignation"}
                  icon={
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  }
                  button={
                    updateFunc ? (
                      <ResUpdate
                        refetch={refetch}
                        url={"article"}
                        data={dataInput}
                        id={row.id}
                      />
                    ) : (
                      updateFunc
                    )
                  }
                >
                  <EntreeAEditForm
                    id={row.id}
                    data={row}
                    references={references}
                    tags={tags}
                    units={units}
                    brands={brands}
                    sousFamiles={sousFamiles.data.data.data}
                    families={families.data.data.data}
                    func={setDataInput}
                    // agreefunc={articleEditHandl/er}
                  />
                </DialogUI>

                <DialogUI
                  text={"êtes-vous sûr"}
                  icon={
                    <>
                      <IconButton>
                        <Delete />
                      </IconButton>
                    </>
                  }
                  button={
                    <>
                      <ResDelete
                        url={"article"}
                        id={row.id}
                        refetch={refetch}
                      />
                    </>
                  }
                >
                  {"Cette action supprimera cet élément parement!"}
                </DialogUI>
              </div>
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
};

export default EntreeARow;
