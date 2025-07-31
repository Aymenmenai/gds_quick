import { Checkbox, IconButton, TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";

import { currencyFormatter } from "../../func/currencyFormatter";
import renderDate from "../../func/date-render";
import DialogUI from "@/components/interface/dialog";
import ResUpdate from "@/components/interface/res/res-update";
import { Delete, Edit } from "@mui/icons-material";
import Input from "@/components/interface/input";
import ResDelete from "@/components/interface/res/res-delete";

const ArticleQSRow = ({ rows, func = () => {}, refetch }) => {
  const [dataInput, setDataInput] = useState({});

  const setInputs = (index, value) => {
    setDataInput({
      ...dataInput,
      [index]: value,
    });
  };

  // console.log(rows);
  return (
    <>
      {rows.length > 0 ? (
        <>
          {rows.map((row) => {
            // console.log(row.id, "[ROW]");
            return (
              <TableRow>
                {/* <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  onClick={(event) => func(event.target)}
                  value={row.id}
                />
              </TableCell> */}

                <TableCell align="center">{row?.Article?.Ref?.name}</TableCell>
                <TableCell align="left">{row?.Article?.name}</TableCell>
                <TableCell align="center">{renderDate(row.date)}</TableCell>
                <TableCell align="center">
                  {currencyFormatter.format(row.price).replace("DZD","DA").trim()}
                </TableCell>
                <TableCell align="center">{row.quantity}</TableCell>
                {/* <TableCell align="center">{row.Article.initial_quantity}</TableCell> */}
                <TableCell align="center">
                  {row?.Sortie?.Beneficiare?.name}
                </TableCell>
                <TableCell align="center">{row?.Article?.Unit?.name}</TableCell>
                <TableCell align="center">
                  {row?.Article?.Entree?.Fournisseur?.name}
                </TableCell>

                <TableCell>
                  <div className="flex justify-center items-center gap-3">
                    <DialogUI
                      text={"Modifier l'article qui sort"}
                      button={
                        <ResUpdate
                          refetch={refetch}
                          url={"articlequisort"}
                          data={dataInput}
                          id={row.id}
                        />
                      }
                      icon={
                        <>
                          <IconButton>
                            <Edit />
                          </IconButton>
                        </>
                      }
                    >
                      <Input
                        initialValue={row.quantity}
                        func={setInputs}
                        index={"quantity"}
                        type={"number"}
                        label={"Quantity"}
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
                            url={"articlequisort"}
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
      ) : (
        <></>
      )}
    </>
  );
};

export default ArticleQSRow;
