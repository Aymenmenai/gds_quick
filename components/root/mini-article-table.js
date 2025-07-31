import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import {
  getBrand,
  getFournisseur,
  getTag,
  getUnit,
  getsousFamily,
} from "../core/requests/requests";
import Loading from "../interface/loading/loading";
import BaseTable from "./base-table";

const MiniArticleTable = ({id,func=()=>{}}) => {
  const maxVal = useQuery("maxVal", () => {
    return axios.get(`/api/v1/article/maxPrice`);
  });
  const units = getUnit();
  const sousFamily = getsousFamily();
  const tags = getTag();
  const brands = getBrand();
  const fournisseurs = getFournisseur();

  if (units.isLoading) return <Loading />;
  if (maxVal.isLoading) return <Loading />;
  if (sousFamily.isLoading) return <Loading />;
  if (tags.isLoading) return <Loading />;
  if (brands.isLoading) return <Loading />;
  if (fournisseurs.isLoading) return <Loading />;

  const select = [
    {
      title: "Unite",
      field: "UnitId",
      data: units.data.data.data,
    },
    {
      title: "Sous-Family",
      field: "SousFamilyId",
      data: sousFamily.data.data.data,
    },
    {
      title: "Le nom de la piece",
      field: "TagId",
      data: tags.data.data.data,
    },
    {
      title: "Fournisseur",
      field: "Entree.Fournisseur.id",
      data: fournisseurs.data.data.data,
    },
    {
      title: "La marque",
      field: "BrandId",
      data: brands.data.data.data,
    },
  ];

  // RANGE
  const range = [
    { title: "Prix", field: "price", max: maxVal.data.data.data, min: 0 },
  ];

  const obj = {
    select,
    range,
  };

  const columns = [
    { field: "", name: "" },
    { field: "Ref.name", name: "Reference" },
    { field: "Tag.name", name: "Nom d'article" },
    // { field: "date", name: "La date" },
    { field: "price", name: "Prix" },
    { field: "quantity", name: "Quantite" },
    // { field: "SousFamilyId", name: "Sous Family" },
    { field: "UnitId", name: "Unite" },
    // { field: "Entree.Fournisseur.name", name: "Le fournisseur" },
  ];

  return (
    <BaseTable func={func} id={id} updateFunc={true} obj={obj} columns={columns} root="mini" />
  );
};

export default MiniArticleTable;
