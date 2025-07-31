import MainTable from "@/components/build/table/main-table";
import React from "react";

export default function Stock({ columns, data }) {
  return (
    <>
      <MainTable
        columns={columns}
        data={data}
        onEditClick={() => {}}
        onDeleteClick={() => {}}
      >
        {/* <TotalPrice price={calculateTotalPrice(entree.Articles)} /> */}
      </MainTable>
    </>
  );
}
