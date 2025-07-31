import React from "react";
import Loading from "@/components/v2/app/containers/loading";
import useURL from "@/components/v2/core/useURL";
import Link from "next/link";
import TableHeader from "./table/table-header";
import { Eye, X } from "lucide-react";
import StockDoc from "./stock-doc";
import Edit from "./tools/edit";
import Add from "./tools/add";
import ArticleDoc from "./article-doc";

// Utility: format ISO date to DD/MM/YYYY
const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date)) return value;
  return date.toLocaleDateString("fr-FR"); // "27/07/2025"
};

const Table = ({
  data,
  setSelect,
  select,
  size,
  show,
  remove,
  edit,
  add,
  history,
}) => {
  const { request } = useURL((state) => state);

  return (
    <table
      className={`${
        size && "h-full"
      } bg-white w-full absolute top-0 left-0 text-sm `}
    >
      <thead className="sticky bg-white shadow-sm border-b top-0 left-0 text-xl">
        <tr className="divide-x text-left">
          {request.fields.map((el, index) => {
            if (el.field === "id") return null;
            return (
              el.active && (
                <TableHeader
                  field={el.field}
                  value={el.value}
                  title={el.name}
                  key={index}
                />
              )
            );
          })}
          {(show || edit || add || history) && (
            <th className="uppercase p-2 w-12 text-center">Options</th>
          )}
        </tr>
      </thead>
      <tbody className="divide-y align-top">
        {data.map((el, rowIndex) => (
          <tr
            key={crypto.randomUUID()}
            className={`${
              rowIndex % 2 && "bg-gray-50/40"
            } divide-x divide-blue-600/0 align-middle`}
          >
            {setSelect &&
              request.fields.map((e, i) => {
                if (e.field.includes("number") && e.field.includes(".")) {
                  if (el[e.value] === 0) return <X key={i} />;
                  return (
                    <td className="text-blue-500" key={i}>
                      <Link
                        href={
                          "/" +
                          e.field.split(".")[0].toLowerCase() +
                          "/" +
                          el[e.field.replace(".number", "_id").toLowerCase()]
                        }
                        passHref
                      >
                        {"#" + el[e.value]}
                      </Link>
                    </td>
                  );
                }

                return (
                  e.active &&
                  e.field !== "id" && (
                    <td key={i} className="p-2">
                      {e.field.toLowerCase().includes("date")
                        ? formatDate(el[e.value])
                        : el[e.value]}
                    </td>
                  )
                );
              })}
            {(show || edit || add || history) && (
              <td className="flex justify-center items-center h-full">
                {show && (
                  <Link href={request.route + "/" + el.id} passHref>
                    <Eye />
                  </Link>
                )}
                {edit && (
                  <Edit forms={edit} initial_data={el} route={request.route} />
                )}
                {add && (
                  <Add
                    btn_title="Modifie les quantite"
                    forms={add.form}
                    route={add.route}
                    initial_data={{ [add.initial_data_key]: el.id }}
                  />
                )}
                {history && history.url === "/timeline" && (
                  <ArticleDoc
                    refId={el.id}
                    refName={el.name}
                    link={history.url}
                  />
                )}
                {history && history.url === "/article/timeline" && (
                  <StockDoc
                    refId={el.id}
                    refName={el.name}
                    link={history.url}
                  />
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
