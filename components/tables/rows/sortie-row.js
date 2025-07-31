import { Checkbox, IconButton, TableCell, TableRow } from "@mui/material";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";

import { currencyFormatter } from "../../func/currencyFormatter";
import renderDate from "../../func/date-render";
import { Delete, Visibility } from "@mui/icons-material";
import { useRouter } from "next/router";
import DialogUI from "@/components/interface/dialog";
import ResDelete from "@/components/interface/res/res-delete";

const SortieRow = ({ rows, func = () => {}, refetch }) => {
  const router = useRouter();
  return (
    <>
      {rows.map((row) => {
        return (
          <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
            <TableCell align="center">{rows.indexOf(row)}</TableCell>
            <TableCell align="center">{row?.number}</TableCell>
            <TableCell align="center">{renderDate(row?.date)}</TableCell>
            <TableCell align="center">
              {currencyFormatter.format(row?.total_price)}
            </TableCell>
            {/* <TableCell align="right">{row.bon_de_livraison}</TableCell> */}
            <TableCell align="center">{row?.Beneficiare?.name}</TableCell>
            <TableCell align="center">
              <div className="flex justify-center items-center gap-3">
                <IconButton onClick={() => router.push(`/sortie/${row.id}`)}>
                  <Visibility />
                </IconButton>
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
                      <ResDelete url={"sortie"} id={row.id} refetch={refetch} />
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

export default SortieRow;
