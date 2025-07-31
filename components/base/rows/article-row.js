import { TableRow } from "@mui/material";
import React from "react";

export default function ArticleRow({index}) {
  return (
    <>
      {/* <TableRow className=" w-full text-4xl text-gray-300 ">
        <TableCell align="center">{index + 1}</TableCell>
        <TableCell align="center">
          {idToData(article.RefId, references.data.data.data)}
        </TableCell>
        <TableCell align="center">
          {`${idToData(article.TagId, tags.data.data.data)} ${idToData(
            article.BrandId,
            brands.data.data.data
          )}`}
        </TableCell>
        <TableCell align="center">{article.date}</TableCell>
        <TableCell align="center">{article.price}</TableCell>
        <TableCell align="center">{article.quantity}</TableCell>
        <TableCell align="center">
          {idToData(article.SousFamilyId, sousFamiles.data.data.data)}
        </TableCell>
        <TableCell align="center">
          {idToData(article.UnitId, units.data.data.data)}
        </TableCell>
        <TableCell align="center">
          <div className="flex gap-2 justify-center items-center">
            <DialogUI
              func={articleEditHandler}
              text={"Modifier la désignation"}
              icon={
                <IconButton>
                  <EditIcon />
                </IconButton>
              }
              // button={false}
            >
              <ArticleEditForm
                id={articles.indexOf(article)}
                data={article}
                references={references}
                tags={tags}
                units={units}
                brands={brands}
                sousFamiles={sousFamiles.data.data.data}
                families={families.data.data.data}
                func={setEditedArticle}
              />
            </DialogUI>

            <IconButton onClick={() => deleteArticle(article.id)}>
              <Delete />
            </IconButton>
          </div>
        </TableCell>
      </TableRow> */}
    </>
  );
}
