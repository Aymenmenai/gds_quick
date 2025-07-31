import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, gridPageCountSelector, GridToolbar, useGridApiContext, useGridSelector } from "@mui/x-data-grid";
import { IconButton, Pagination, Stack } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useDemoData } from "@mui/x-data-grid-generator";
import { gridPageSelector } from "@mui/x-data-grid";


function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  //console.log(pageCount);

  return (
    <Pagination
      color="primary"
      count={pageCount}
      page={page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}



export default function Table({
  rows,
  columns,
  currpage,
  funcPage,
  totalPage,
}) {
  const { data } = useDemoData({
    dataSet: "Commodity",
    rowLength: 100,
    maxColumns: 6
  });
  return (
    <Box sx={{ height: 900, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={[...columns]}
        // components={{ Toolbar: GridToolbar }}
         pagination
        pageSize={5}
        rowsPerPageOptions={[5]}
        components={{
          Pagination: CustomPagination
        }}
        {...data}
      />
    </Box>
  );
}
