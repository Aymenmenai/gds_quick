import React, { useEffect, useState, cloneElement } from "react";
import { Add as AddIcon } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import StandardDialog from "@/components/base/dialog/standard-dialog";
import ScrollShadow from "@/components/interface/shadow/scroll-shadow";
import { formatDate } from "@/components/logic/mini-func";
import SearchSelect from "@/components/v2/app/build/inputs/search-select";
import { useStoreArticle } from "@/components/state/useStoreArticle";
import Dialog from "@/components/v2/app/containers/dialog";
import SecondaryBtn from "@/components/interface/btn/secondary-btn";
import MainBtn from "@/components/interface/btn/main-btn";

const defaultArticle = {
  name: "",
  RefId: null,
  TagId: null,
  BrandId: null,
  UnitId: null,
  SousFamilyId: null,
  unit_price: 0,
  tax: 0,
  discount: 0,
  quantity: 0,
  place: "",
  Attributes: [],
  price: 0,
};

const selectFields = [
  {
    title: "Reference",
    field: "RefId",
    api: "/ref?page=1&limit=5&fields=id,name",
    add: true,
  },
  {
    title: "Nom de la pièce",
    field: "TagId",
    api: "/tag?page=1&limit=5&fields=id,name",
    add: true,
  },
  {
    title: "La Marque",
    field: "BrandId",
    api: "/brand?page=1&limit=5&fields=id,name",
    add: true,
  },
  {
    title: "Unité",
    field: "UnitId",
    api: "/unit?page=1&limit=5&fields=id,name",
    add: true,
  },
  {
    title: "Sous-Famille",
    field: "SousFamilyId",
    api: "/sousFamily?page=1&limit=5&fields=id,name",
    add: false,
  },
];

const ArticleForm = ({
  icon,
  children,
  defaultData = {},
  onSubmit = () => {},
}) => {
  const [article, setArticle] = useState({ ...defaultArticle, ...defaultData });
  const [attributes, setAttributes] = useState(defaultData?.Attributes || []);
  const { setArticleData } = useStoreArticle((state) => state);

  useEffect(() => {
    const unitPrice = +article.unit_price || 0;
    const tax = +article.tax || 0;
    const discount = +article.discount || 0;
    const price = unitPrice + tax - (unitPrice * discount) / 100;
    setArticle((prev) => ({ ...prev, price }));
  }, [article.unit_price, article.tax, article.discount]);

  const fillArticle = (field, value) => {
    setArticle((prev) => ({ ...prev, [field]: value }));
  };

  const addAttribute = () =>
    setAttributes((prev) => [...prev, { name: "", value: "" }]);

  const updateAttribute = (index, key, value) => {
    const updated = [...attributes];
    updated[index][key] = value;
    setAttributes(updated);
  };

  const removeAttribute = (index) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog
      target={
        <button className="btn-r text-blue-500 " aria-label="Modifier">
          {icon}
        </button>
      }
      title="Créer / Modifier un Article"
    >
      {({ close }) => (
        <form
          className="flex flex-col h-full justify-between z-[999] items-center"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ ...article, Attributes: attributes });
            setArticle({ ...defaultArticle, ...defaultData });

            // close();
          }}
          // className="p-3 grid gap-3 "
        >
          <div className="relative overflow-y-auto h-full p-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label>La Désignation</label>
                <input
                  type="text"
                  value={article.name}
                  onChange={(e) => fillArticle("name", e.target.value)}
                  className="input w-full"
                />
              </div>

              {selectFields.map((el) => (
                <SearchSelect
                  key={el.field}
                  title={el.title}
                  api={"/" + el.api}
                  add={el.add}
                  initialId={article[el.field]}
                  onSelect={(opt) => fillArticle(el.field, opt.id)}
                />
              ))}

              {[
                { label: "Prix unitaire", field: "unit_price" },
                { label: "Montant de la taxe", field: "tax" },
                { label: "Remise (%)", field: "discount" },
                { label: "Quantité", field: "quantity" },
                { label: "Emplacement", field: "place", type: "text" },
              ].map(({ label, field, type = "number" }) => (
                <div key={field}>
                  <label>{label}</label>
                  <input
                    type={type}
                    value={article[field]}
                    onChange={(e) => fillArticle(field, e.target.value)}
                    className="input w-full"
                  />
                </div>
              ))}

              <div className="col-span-2 text-center text-lg font-bold">
                Prix calculé : {article.price || 0} DA
              </div>
            </div>

            <div className="grid gap-3 py-4">
              <label className="font-bold text-lg">Attributs</label>
              {attributes.map((attr, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    className="input"
                    placeholder="Nom"
                    value={attr.name}
                    onChange={(e) =>
                      updateAttribute(index, "name", e.target.value)
                    }
                  />
                  <input
                    className="input"
                    placeholder="Valeur"
                    value={attr.value}
                    onChange={(e) =>
                      updateAttribute(index, "value", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="text-red-500 font-bold"
                    onClick={() => removeAttribute(index)}
                  >
                    X
                  </button>
                </div>
              ))}
              <div className="flex justify-center">
                <IconButton onClick={addAttribute}>
                  <AddIcon />
                </IconButton>
              </div>
            </div>
            <ScrollShadow />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            {React.Children.map(children, (child) =>
              React.isValidElement(child) &&
              typeof child.props.func === "function"
                ? cloneElement(child, {
                    func: () => {
                      const payload = { ...article, Attributes: attributes };
                      setArticleData(payload);
                      const result = child.props.func(payload);
                      setArticle(defaultArticle);
                      setAttributes([]);
                      return result;
                    },
                  })
                : child
            )}
          </div>

          <div className="w-full flex justify-between gap-2 mt-6">
            <button type="button" onClick={close} className="btn-sec w-1/2">
              Annuler
            </button>
            <button type="submit" className="btn-pri w-1/2">
              Enregistrer
            </button>
          </div>
          {/* <SecondaryBtn func={close}>Annuler l'opération</SecondaryBtn> */}
          {/* <MainBtn func={() => {}}>Ajouter un article</MainBtn> */}
        </form>
      )}
    </Dialog>
  );
};

export default ArticleForm;
