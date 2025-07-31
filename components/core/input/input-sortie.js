import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import DialogUI from "@/components/interface/dialog";
import Res from "@/components/interface/res/res";
import SelectUI from "@/components/interface/select";
import Input from "@/components/interface/input";
import StockForm from "../form/stock-form";
import {
  IconButton,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Loading from "@/components/interface/loading/loading";
import { useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import MainTable from "../../build/table/base-table";
import {
  Add,
  Delete,
  MinorCrashOutlined,
  Remove,
  Visibility,
} from "@mui/icons-material";
import { idToData } from "../func/id-to-data";
import axios from "axios";
import { useQuery } from "react-query";
import { getApi } from "../requests/requests";
import { currencyFormatter } from "../func/currencyFormatter";
import renderDate from "../func/date-render";
import useStoreIds from "../store/store";
import Toggle from "@/components/interface/toggle";
import { getCurrentDate } from "../func/generate-time";

export default function InputSortie() {
  let aqs = useStoreIds((state) => state.ids);
  const stateChanger = useStoreIds((state) => state.selectedArr);

  // console.log(ids);
  let state = [];
  // get STATE
  aqs.forEach((el) => {
    state.push({ ...el, quantity: 0, price: 0 });
  });

  // STATES
  const [dataInput, setDataInput] = useState({
    date: getCurrentDate(Date.now()),
  });
  const [article, setArticle] = useState({});
  const [articles, setArticles] = useState(state);
  const [engine, setEngine] = useState(false);
  const [matricule, setMatricule] = useState(false);

  // Beneficiare
  const beneficiares = getApi("beneficiare");
  //   ARTICLES
  // const { data: a, isLoading } = useQuery("articletest", () => {
  //   return axios.get(`/api/v1/article/forSortie?id=${ids}`);
  // });
  //   COUNT
  const count = useQuery("numSortie", () => {
    return axios.get("/api/v1/sortie/count");
  });
  const vehicules = useQuery("vehicules", () => {
    return axios.get(`/api/v1/vehicule/option`);
  });

  const vehiculeCodes = useQuery(
    "vehiculeCodes",
    () => {
      return axios.get(
        `/api/v1/vehiculeCode/option?${
          matricule ? `VehiculeId=${matricule}` : ""
        }`
      );
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  // TABLE COLUMN
  const columns = [
    { field: "", name: "" },
    // { field: "id", name: "ID" },
    { field: "ReferenceId", name: "Reference" },
    { field: "name", name: "Nom d'article" },
    { field: "date", name: "La date" },
    { field: "price", name: "Prix" },
    { field: "quantity", name: "Quantite" },
    { field: "SousFamilyId", name: "SousFamily" },
    { field: "UnitId", name: "Unite" },
  ];

  // FUNCTION
  const engineHandler = (index, value) => {
    setMatricule(value);
    // vehiculeCodes.refetch();
  };

  const setInputs = (index, value) => {
    setDataInput({
      ...dataInput,
      [index]: value,
      number: count.data.data.data + 1,
    });
  };

  // BRING ARTICLE
  const agree = () => {
    const newArticles = [...articles];
    const id = articles.length;
    const data = { ...article, id };

    newArticles.push(data);
    // console.log(newArticles)
    setArticles(newArticles);

    // THIS FUNCTION CAN BE ADDED BEFORE MUTAION *****!!!
    setArticle({});
    setInputs("articles", newArticles);
  };

  // GET TOTAL PRICE
  const getTotalPrice = (arr) => {
    let total = 0;
    arr.forEach((el) => {
      total = total + el.quantity * el.price;
    });
    return total;
  };

  // DELETE ARTICLE
  const deleteArticle = (val) => {
    let arr = [];
    articles.map((el) => {
      if (el.id !== val.id) {
        arr.push(el);
      }
    });
    setArticles(arr);
    setInputs("articles", arr);
    stateChanger(arr);
  };

  // CONDITION
  const maxVal = (curr, max) => {
    // console.log(max);
    let val = curr;
    if (curr + 1 > max) {
      val = max;
    }
    if (curr - 1 < 0) {
      val = 0;
    }

    return val;
  };
  // ADD QUANTITY
  const addHandler = (id, main) => {
    let arr = [...articles];
    articles.forEach((el) => {
      // console.log('HELLOOO',el,articles.indexOf(el) === id,id)
      if (el === id) {
        arr[arr.indexOf(el)].quantity = maxVal(el.quantity + 1, main.quantity);
        arr[arr.indexOf(el)].price = main.price;
      }
    });

    // console.log(arr, "0000");
    setArticles([...arr]);
  };

  const minusHandler = (id, main) => {
    let arr = [...articles];
    articles.forEach((el) => {
      // console.log('HELLOOO',el,articles.indexOf(el) === id,id)
      if (el === id) {
        arr[arr.indexOf(el)].quantity = maxVal(el.quantity - 1, main.quantity);
        arr[arr.indexOf(el)].price = main.price;
      }
    });

    // console.log(arr, "0000");
    setArticles([...arr]);
  };

  // DELETE AN ENGINE FROM THE OBJECT
  const deleteEngine = () => {
    let obj = { ...dataInput };
    if (!engine) {
      delete obj.VehiculeCodeId;
    }
    setDataInput(obj);
  };

  // USEEFFECT
  useEffect(() => {
    deleteEngine();
    setMatricule(false);
  }, [engine]);
  // ENGINE
  useEffect(() => {
    vehiculeCodes.refetch();
  }, [matricule, engine]);

  useEffect(() => {
    setDataInput({ ...dataInput, articles });
  }, [articles]);

  if (count.isLoading) return <Loading />;
  if (beneficiares.isLoading) return <Loading />;
  // if (isLoading) return <Loading />;

  // let selectedArticle = a.data.data || false;
  //console.log(dataInput, "[DATA===]");

  // EDIT AND EASE IDS
  const refetchEaseFunc = () => {
    stateChanger([]);
    count.refetch;
  };

  // console.log(beneficiares.data.data.data, selectedArticle.data.data.data);
  // console.log(dataInput,'[SORTIE DATA INPUT]');
  return (
    <>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <div className="text-6xl font-semibold uppercase">Créer un sortie</div>
        {/* <Loading/> */}
        <div className="flex items-center gap-4 flex-wrap">
          <TextField
            disabled
            label={"Numero d'sortie"}
            defaultValue={count.data.data.data + 1}
          />

          <Input
            func={setInputs}
            index={"date"}
            label={"La date"}
            type={"date"}
            initialValue={getCurrentDate(Date.now())}
          />

          <SelectUI
            options={beneficiares.data.data.data}
            func={setInputs}
            index={"BeneficiareId"}
            label={"Beneficiare"}
          />
        </div>

        <div className="flex justify-strat gap-2 items-center pb-4">
          <div className="flex scale-75 gap-1 items-center justify-center ">
            Engin
            <Toggle func={setEngine} />
          </div>
          {engine ? (
            <>
              <SelectUI
                func={engineHandler}
                options={vehicules.data.data.data}
                label={"Vehicule"}
                index={"VehiculeId"}
              />
              <>
                {matricule && engine ? (
                  <>
                    <SelectUI
                      options={vehiculeCodes.data.data.data}
                      func={setInputs}
                      index={"VehiculeCodeId"}
                      label={"Vehicule matricule"}
                    />
                  </>
                ) : (
                  <></>
                )}
              </>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="flex justify-end items-center py-2">
          <Res
            push={true}
            refetch={refetchEaseFunc}
            text={"Ajouter un entrée"}
            data={dataInput}
            url={"sortie"}
          />
        </div>
        <>
          <MainTable columns={columns}>
            {aqs.map((article) => {
              return (
                <TableRow
                  key={article.id}
                  className=" w-full text-4xl text-gray-300 "
                >
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">{article?.Ref?.name}</TableCell>
                  <TableCell align="center">{article.name}</TableCell>
                  <TableCell align="center">
                    {renderDate(article?.date)}
                  </TableCell>
                  <TableCell align="center">{article?.price}</TableCell>
                  <TableCell align="center">
                    <div className="flex justify-center items-center gap-1">
                      <IconButton
                        onClick={() =>
                          addHandler(articles[aqs.indexOf(article)], article)
                        }
                      >
                        <Add />
                      </IconButton>
                      <div>
                        {`${articles[aqs.indexOf(article)]?.quantity}/${
                          article.quantity
                        }`}
                      </div>
                      <IconButton
                        onClick={() =>
                          minusHandler(articles[aqs.indexOf(article)], article)
                        }
                      >
                        <Remove />
                      </IconButton>
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    {article.SousFamily?.name}
                  </TableCell>
                  <TableCell align="center">{article?.Unit?.name}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => deleteArticle(article)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell colSpan={8} align="center">
                le price total
              </TableCell>
              <TableCell>
                {currencyFormatter.format(getTotalPrice(articles)).replace("DZD","DA").trim()}
              </TableCell>
            </TableRow>
          </MainTable>
        </>
      </Box>
    </>
  );
}
