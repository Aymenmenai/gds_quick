import React, { Fragment } from "react";
import BaseTable from "./base-table";
import GenerateRow from "./generate-row";
import { IconButton, TableCell, TableRow } from "@mui/material";
import { Class, Delete, Edit, Update, Visibility } from "@mui/icons-material";
import ArticleForm from "../form/article-form";
import SecondaryBtn from "@/components/interface/btn/secondary-btn";
import MainBtn from "@/components/interface/btn/main-btn";
import DeleteConfirmation from "../popup/delete-confirm";
import StandardForm from "../form/StandardForm";
import StandardDialog from "@/components/base/dialog/standard-dialog";
import {
  currencyFormatter,
  removeExtraZeros,
} from "@/components/logic/mini-func";

const TotalPrice = ({ price }) => {
  return (
    <>
      <div className="font-extralight uppercase">{"Le price total: "}</div>
      <div className="text-2xl font-semibold">
        {removeExtraZeros(currencyFormatter.format(price))
          .replace("DZD", "DA")
          .trim()}
      </div>
    </>
  );
};

export default function MainTable({
  columns,
  data,
  children,
  onDeleteClick,
  onEditClick,
  editFunc,
  standardEdit,
  onViewClick,
  // TABLE OPTION
  option = false,
  extra = false,
  //
  special = false,
  selection,
  // SECOND OPTION
  secondRoot = false,
  secondColumns = false,
  editId = false,
  fieldName = false,
  // forsecond table
  filterTable = false,
  is_vehicule = false,
  // TEMPORORY
  updateNameSortie,
  sortieChangingName = false,
}) {
  return (
    <>
      <BaseTable selection={selection} option={option} columns={columns}>
        {data.length > 0 ? (
          <>
            {[...data].map((el) => {
              return (
                <GenerateRow
                  selection={selection}
                  key={el.id}
                  data={el}
                  columns={columns}
                >
                  {option ? (
                    <>
                      {!!special && (
                        <>
                          <StandardForm
                            title={"Modification "}
                            // data={el}
                            vehicule={is_vehicule}
                            inputs={standardEdit}
                            updateFunc={editFunc}
                            btn={
                              <>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    console.log(e.target);
                                  }}
                                >
                                  <Edit sx={{ width: 20, height: 20 }} />
                                </IconButton>
                              </>
                            }
                          >
                            <ul>
                              {!!el.Refs.length && (
                                <>
                                  {el.Refs.map((e) => {
                                    return <li key={e.id}>{e.name}</li>;
                                  })}
                                </>
                              )}
                            </ul>
                          </StandardForm>
                        </>
                      )}
                      {sortieChangingName && (
                        <IconButton
                          size="small"
                          onClick={() => updateNameSortie(el.id, el.number)}
                        >
                          <Update sx={{ width: 20, height: 20 }} />
                        </IconButton>
                      )}
                      {onViewClick && (
                        <IconButton
                          size="small"
                          onClick={() => onViewClick(el.id)}
                        >
                          <Visibility sx={{ width: 20, height: 20 }} />
                        </IconButton>
                      )}
                      {/* POSSIBILITY TO EDIT */}
                      {onEditClick ? (
                        <ArticleForm
                          icon={<Edit sx={{ width: 20, height: 20 }} />}
                          onSubmit={(new_data) => editFunc(el, new_data)}
                          defaultData={{ ...el }}
                        >
                          {/* FOR ACTION */}
                          {/* <SecondaryBtn func={() => onEditClick(el)}>
                            {"Retour aux paramètres"}
                          </SecondaryBtn>
                          <MainBtn func={() => editFunc(el.id || index)}>
                            {"Modifier les valeurs"}
                          </MainBtn> */}
                        </ArticleForm>
                      ) : (
                        <></>
                      )}
                      {/* STANDARD */}
                      {standardEdit && !special ? (
                        <StandardForm
                          title={"Modification "}
                          data={el}
                          vehicule={is_vehicule}
                          inputs={standardEdit}
                          updateFunc={editFunc}
                          btn={
                            <>
                              <IconButton size="small" onClick={() => {}}>
                                <Edit sx={{ width: 20, height: 20 }} />
                              </IconButton>
                            </>
                          }
                          // FOR EXTRA OPS
                          secondRoot={secondRoot}
                          secondColumns={secondColumns}
                          parentId={el.id}
                          editId={editId}
                          fieldName={fieldName}
                          filterTable={filterTable}
                        />
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    option
                  )}

                  {el?.Articles?.length > 0 && (
                    <StandardDialog
                      btn={
                        <IconButton>
                          <Class sx={{ width: 20, height: 20 }} />
                        </IconButton>
                      }
                    >
                      <BaseTable
                        // selection={selection}
                        // option={option}
                        columns={[
                          { field: "Ref.name", name: "Reference" },
                          { field: "name", name: "Designiation" },
                          { field: "date", name: "La date" },
                          { field: "price", name: "Prix" },
                          { field: "initial_quantity", name: "Quantite" },
                          { field: "tax", name: "la tax" },
                          { field: "SousFamily.name", name: "Sous Family" },
                          { field: "Unit.name", name: "Unite" },
                        ]}
                      >
                        {el.Articles.map((e, id) => {
                          return (
                            <GenerateRow
                              // selection={selection}
                              key={id}
                              index={id + 1}
                              data={e}
                              columns={[
                                { field: "Ref.name", name: "Reference" },
                                { field: "name", name: "Designiation" },
                                { field: "date", name: "La date" },
                                { field: "price", name: "Prix" },
                                {
                                  field: "initial_quantity",
                                  name: "Quantite",
                                },
                                { field: "tax", name: "la tax" },
                                {
                                  field: "SousFamily.name",
                                  name: "Sous Family",
                                },
                                { field: "Unit.name", name: "Unite" },
                              ]}
                            >
                              <TotalPrice price={el.total_price} />
                            </GenerateRow>
                          );
                        })}
                      </BaseTable>
                    </StandardDialog>
                  )}
                  {/* IF THERE IS POSSIBLITY TO DELETE */}
                  {onDeleteClick ? (
                    <DeleteConfirmation
                      func={() => onDeleteClick(el.id)}
                      btn={
                        <IconButton size="small">
                          <Delete sx={{ width: 20, height: 20 }} />
                        </IconButton>
                      }
                    />
                  ) : (
                    <></>
                  )}

                  {extra ? (
                    <>
                      <StandardDialog
                        btn={
                          <>
                            <IconButton size="small">
                              <Visibility sx={{ width: 20, height: 20 }} />
                            </IconButton>
                          </>
                        }
                      >
                        {extra}
                      </StandardDialog>
                      <>{secondColumns}</>
                    </>
                  ) : (
                    <></>
                  )}
                  {/* POSSIBILITE TO VIEW */}
                </GenerateRow>
              );
            })}
          </>
        ) : (
          <TableRow>
            <TableCell className=" h-[60vh] " colSpan={columns.length + 2}>
              <div className=" w-full h-full flex justify-center items-center ">
                {
                  "Aucun article n'est présent sur la table, celle-ci est complètement vide."
                }
              </div>
            </TableCell>
          </TableRow>
        )}
        <div className=" bg-red-400 w-full">
          <div className="absolute bottom-0 w-full py-3 px-4 flex items-center justify-end gap-3 backdrop-blur-sm">
            {children}
          </div>
        </div>
      </BaseTable>
    </>
  );
}
