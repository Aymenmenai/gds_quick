import React from "react";
import { TableCell } from "@mui/material";
import {
  currencyFormatter,
  removeExtraZeros,
  renderDate,
} from "@/components/logic/mini-func";
import Input from "@/components/interface/input";
import { useStoreAQS } from "@/components/state/useStoreSortie";
import { useRouter } from "next/router";
import Link from "next/link";
import { DoNotDisturbAlt } from "@mui/icons-material";

const renderCell = (column, rowData) => {
  const router = useRouter();
  const { ids, editCurrQuantity } = useStoreAQS((state) => state);
  const fieldPath = column.field.split("."); // Split the nested property path
  let cellValue = rowData;

  // Traverse the nested properties to get the final value
  for (const field of fieldPath) {
    // console.log(cellValue, field);
    cellValue = cellValue[field] || "/";
    if (cellValue === undefined) {
      break; // Stop if the value becomes undefined
    }
  }
  if (column.field === "Entree.number") {
    // console.log(rowData.Entree.id , cellValue);

    return (
      <>
        {cellValue !== "/" ? (
          <TableCell>
            <Link href={`/entree/${rowData.Entree.id}`} passHref>
              <div className="text-blue-400 font-bold underline text-lg text-center">
                #{cellValue}
              </div>
            </Link>
          </TableCell>
        ) : (
          <TableCell>
            <div className="text-red-600 cursor-not-allowed text-center">
              <DoNotDisturbAlt />
            </div>
          </TableCell>
        )}
      </>
    );
  }
  if (column.field === "Sortie.number") {
    // console.log(rowData.Entree.id , cellValue);

    return (
      <>
        {cellValue !== "/" ? (
          <TableCell>
            <Link href={`/sortie/${rowData.Sortie.id}`} passHref>
              <div className="text-blue-400 font-bold underline text-lg text-center">
                #{cellValue}
              </div>
            </Link>
          </TableCell>
        ) : (
          <TableCell>
            <div className="text-red-600 cursor-not-allowed text-center">
              <DoNotDisturbAlt />
            </div>
          </TableCell>
        )}
      </>
    );
  }
  if (column.field === "Article.Entree.number") {
    // console.log(rowData.Entree.id , cellValue);

    return (
      <>
        {cellValue !== "/" ? (
          <TableCell>
            <Link href={`/entree/${rowData.Article.Entree.id}`} passHref>
              <div className="text-blue-400 font-bold underline text-lg text-center">
                #{cellValue}
              </div>
            </Link>
          </TableCell>
        ) : (
          <TableCell>
            <div className="text-red-600 cursor-not-allowed text-center">
              <DoNotDisturbAlt />
            </div>
          </TableCell>
        )}
      </>
    );
  }

  // console.log(cellValue, column.field,column.field === "VehiculeCodes", "");
  if (
    column.field === "VehiculeType" ||
    column.field === "SousFamilies" ||
    column.field === "Refs"
  ) {
    // if (!isNaN(cellValue)) {
    // cellValue = [...cellValue.map((obj) => obj.name)];
    // console.log(cellValue,column.field,rowData.SousFamilies)
    return (
      <TableCell>
        <ul>
          <>
            {cellValue.map((el, index) => {
              return <li key={index}>{el.name}</li>;
            })}
          </>
        </ul>
      </TableCell>
    );
    // console.log(cellValue, "777777777777777");
    // } else {
    //   cellValue = "/";
    // }
  }

  if (column.field === "total_price" || column.field === "price") {
    // console.log(cellValue)
    // If the column type is 'price', apply the currencyFormat function
    if (!isNaN(cellValue)) {
      cellValue = removeExtraZeros(currencyFormatter.format(cellValue)).replace("DZD","DA").trim();
    } else {
      cellValue = removeExtraZeros(currencyFormatter.format(0)).replace("DZD","DA").trim();
    }
  }

  if (column.field === "quantityChangable") {
    return (
      <TableCell align="center">
        <div className="w-full h-full flex justify-center items-center gap-0.5">
          <div className=" w-24 flex justify-center items-center">
            <Input
              label={""}
              type="number"
              index={ids.indexOf(rowData)}
              func={editCurrQuantity}
              initialValue={ids[ids.indexOf(rowData)]?.currQuantity}
            />
          </div>
          <div className="text-sm font-bold ">{`/${rowData["quantity"]}`}</div>
        </div>
      </TableCell>
    );
  }

  if (column.field === "date" || column.field === "createdAt") {
    // If the column type is 'price', apply the currencyFormat function
    cellValue = renderDate(cellValue);
  }
  if (column.field === "Sortie.Vehicule.name") {
    cellValue = rowData.Sortie.Vehicule?.name ? `${rowData.Sortie.Vehicule.VehiculeClient?.name || "---"} ${rowData.Sortie.Vehicule?.name || ""} (${rowData.Sortie.Vehicule?.matricule || "/"}) ` : '/'
  }

  if (column.field === "sign") {
    return <TableCell align="center">
      {/* <div className="">

      </div> */}
      <svg className={`${cellValue === "sign--" ? 'stroke-red-600 ' : 'stroke-green-700 rotate-180'} w-4 h-4`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </TableCell>
  }
  if (column.field === "p") {
    // console.log(cellValue)
    // If the column type is 'price', apply the currencyFormat function
    const sign = cellValue.split('')[0]
    if (!isNaN(cellValue)) {
      cellValue = removeExtraZeros(currencyFormatter.format(cellValue)).replace("DZD","DA").trim();
    } else {
      cellValue = removeExtraZeros(currencyFormatter.format(0)).replace("DZD","DA").trim();
    }
    return <TableCell>
      <div className={`${sign === '-' ? 'text-red-600' : 'text-green-600'} font-bold`}>
        {cellValue}
      </div>
    </TableCell>


  }
  // FOR THE ALERT

  if (
    column.field === "refs" ||
    column.field === "tags" ||
    column.field === "brands"
  ) {
    cellValue = cellValue.join(",");
  }
  // console.log(cellValue, column);
  return (
    <TableCell key={column.field} className="p-1" align="center">
      {cellValue}
    </TableCell>
  );
};

const RenderRow = ({ rowData, columns }) => {
  return (
    <React.Fragment>
      {columns.map((column, index) => (
        <React.Fragment key={`${column.key || column}-${index}`}>
          {renderCell(column, rowData)}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};

export default RenderRow;

