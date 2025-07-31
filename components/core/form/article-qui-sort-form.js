import Input from "@/components/interface/input";
import Loading from "@/components/interface/loading/loading";
import SelectUI from "@/components/interface/select";
import { Slider } from "@mui/material";
// import axios from "axios";
import React, { useEffect, useState } from "react";
// import { useQuery } from "react-query";

const ArticleQuiSortForm = ({
  func,
  tags,
  brands,
  categories,
  references,
  units,
}) => {
  // DATA

  const [inputs, setInputs] = useState({});
  // const reference = ["12134", "osifsd9u"];
  // const category = ["12134", "osifsd9u"];
  // const unit = ["12134", "osifsd9u"];
  // const tag = ["12134", "osifsd9u"];
  // const brand = ["12134", "osifsd9u"];

  // FUNCTIONS
  const setInput = (index, value) => {
    setInputs({ ...inputs, [index]: value });
    func(inputs);
  };

  // SET FORM
  const Submiting = (e) => {
    e.preventDefault();
   // console.log(e.target[2].value);
  };
  // console.log(inputs)
  return (
    <form onSubmit={(e) => Submiting(e)} className="grid gap-2 w-full">
      <button>Click</button>
      <SelectUI
        func={setInput}
        label={"Reference"}
        options={references}
        index={"ReferenceId"}
        id={"ReferenceId"}
      />
      <SelectUI
        func={setInput}
        label={"Category"}
        options={categories}
        index={"CategoryId"}
      />
      <SelectUI
        func={setInput}
        label={"Unit"}
        options={units}
        index={"UnitId"}
      />
      <SelectUI
        func={setInput}
        label={"Nom de piece"}
        options={tags}
        index={"TagId"}
      />
      <SelectUI
        func={setInput}
        label={"la Marque"}
        options={brands}
        index={"BrandId"}
      />
      <hr />
      <Input
        func={setInput}
        type="number"
        label={"Quantite"}
        index={"quantity"}
      />
      <Input func={setInput} type="number" label={"Prix"} index={"price"} />
      <Input func={setInput} type="number" label={"Alert"} index={"alert"} />
      <Input func={setInput} type="date" label={"Date"} index={"date"} />
      <Input
        func={setInput}
        type="text"
        label={"L'emplacement"}
        index={"place"}
      />
      <div>
        <div className="text-sm">Taxe</div>
        <div className="flex gap-3 justify-center items-center">
          <Slider
            defaultValue={0}
            onChange={({ target }) => setInput("tax", target.value)}
          />
          <div>{!inputs.tax ? <>0%</> : <>{inputs.tax}%</>}</div>
        </div>
      </div>
      <hr />
    </form>
  );
};

export default ArticleQuiSortForm;
