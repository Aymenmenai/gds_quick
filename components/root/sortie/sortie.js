import { currencyFormatter } from "@/components/core/func/currencyFormatter";
import MainTable from "@/components/core/tables/main-table";
import DialogUI from "@/components/interface/dialog";
import { Edit, Print, Visibility } from "@mui/icons-material";
import { Checkbox, IconButton, TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";

const Sortie = () => {
    // EDIT BENEFICIARE,FACTURE,DATE
    // EDIT


  const [dataInput, setDataInput] = useState({});
  const [article, setArticle] = useState({});
  const [articles, setArticles] = useState([]);

  const data = [
    {
      id: 1,
      name: "RAIL-91773636",
      quantity: 91882,
      price: 1224,
      Tag: {
        name: "Pompt",
      },
      Ref: {
        name: "82776 76 65",
      },
      Entree: {
        Fournisseur: {
          name: "N",
        },
      },
    },
  ];

  const rows = data;
  //   const rows = data.data.data.data;
  // const pages = data.data.data.doc_size;
  //   console.log(data);

  const columns = [
    { field: "Reference.name", name: "Reference" },
    { field: "designatiam", name: "Destignation" },
    { field: "quantity", name: "Quantite" },
    { field: "price", name: "Prix" },
    { field: "Entree.Fournisseur", name: "Fournisseur" },
  ];

  const getTotalPrice = (arr) => {
    let total = 0;
    arr.forEach((el) => {
      total =
        total + el.quantity * el.price * (1 + (el.tax ? el.tax / 100 : 0));
    });
    return total;
  };

  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-3xl font-bold">Sortie N 1</div>
          <div className="text-lg">Beneficiare : Beneficiare</div>
          <div className="text-lg">facture : 10983B</div>
          <div className="text-gray-500">date : 200-219-29</div>
        </div>

        <div className="flex gap-2">
          <IconButton>
            <Print />
          </IconButton>
          <IconButton>
            <Edit />
          </IconButton>
        </div>
      </div>

      <MainTable columns={columns} sortFunc={() => {}}>
        {rows.map((row) => {
          return (
            <TableRow hover tabIndex={-1} key={row.id}>
              <TableCell align="center">{row.Ref.name} Reference</TableCell>
              <TableCell align="center">{row.Tag.name} Tag,Brand </TableCell>
              <TableCell align="center">{row.quantity} </TableCell>
              <TableCell align="center">{row.price} Price</TableCell>
              <TableCell align="center">
                {row.Entree.Fournisseur.name}
              </TableCell>


            
              <TableCell align="center">
                <DialogUI
                  text={"Les designiation"}
                  button={false}
                  icon={
                    <IconButton>
                      <Visibility />
                    </IconButton>
                  }
                ></DialogUI>
              </TableCell>
            </TableRow>
          );
        })}
        <TableRow>
          <TableCell colSpan={5} align="center">
            le prix total
          </TableCell>
          <TableCell align="center">
            <div className="text-xl">
            {currencyFormatter.format(getTotalPrice(articles))}

            </div>
          </TableCell>
        </TableRow>
      </MainTable>
    </div>
  );
};

export default Sortie;
