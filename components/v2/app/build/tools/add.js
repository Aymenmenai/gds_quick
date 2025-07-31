import { Plus } from "lucide-react";
import Dialog from "../../containers/dialog";
import AutoValue from "../inputs/auto-value";
import SearchSelect from "../inputs/search-select";
import Default from "../inputs/default";
import { useStatus } from "@/components/v2/core/useStatus";
import { useState } from "react";
import { url } from "@/components/v2/global/variable";

const Add = ({ forms, route, btn_title, initial_data = {} }) => {
  const { setError, setSuccess } = useStatus();
  const [data, setData] = useState(initial_data);

  // CREATE NEW ITEMS
  const createNewItem = async () => {
    try {
      // Basic validation (optional)
      if (!data || Object.keys(data).length === 0) {
        setError("Veuillez remplir les champs requis.");
        return;
      }

      const response = await fetch(`${url}${route}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        setError(`Erreur: ${errorMsg}`);
        return;
      }

      const result = await response.json();
      setSuccess("Élément créé avec succès !");
    } catch (err) {
      console.error("Create Error:", err);
      setError("Une erreur s’est produite lors de la création.");
    }
  };

  // SAVE ITEMS
  const saveNewItem = () => {
    const savedValue = {
      ...data,
      id: crypto.randomUUID(),
      route,
      MagazinId: user?.MagazinId,
      UserId: user?.id,
    };
    //console.log(savedValue);
    setSuccess("yep");
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // prevents page reload
  };

  // console.log(data)

  return (
    <Dialog
      target={
        <button className="ring-1 items-center justify-center rounded flex">
          <Plus />
        </button>
      }
    >
      <form
        className="flex flex-col h-full justify-between items-center"
        onSubmit={handleSubmit}
      >
        <div className="flex justify-between items-center">
          <div className="text-3xl font-bold">{"Create a new element"}</div>
        </div>
        <div
          style={{ margin: 0 }}
          className={`${
            forms.length > 5 ? "grid-cols-2 " : "grid-cols-1  "
          } w-full py-6 px-3 flex-1 place-content-start grid`}
        >
          {forms.map((el) => {
            if (el.auto)
              return (
                <AutoValue
                  func={(value) =>
                    setData((prev) => ({ ...prev, [el.value]: value }))
                  }
                  api={el.url}
                  title={el.name}
                  key={el.id}
                />
              );
            if (el.select)
              return (
                <SearchSelect
                  onSelect={(value) =>
                    setData((prev) => ({ ...prev, [el.value]: value.id }))
                  }
                  title={el.name}
                  api={el.url}
                  add={el.add}
                  key={el.id}
                />
              );
            return (
              <Default
                func={(value) =>
                  setData((prev) => ({ ...prev, [el.value]: value }))
                }
                type={el.type}
                key={el.id}
                title={el.name}
              />
            );
          })}
        </div>

        <div className="w-full flex">
          <button type="button" onClick={() => {}} className="btn-sec">
            Annuler
          </button>
          {/* <button type="button" onClick={saveNewItem} className="btn-sec">
            Save value for later
          </button> */}
          <button
            type="button"
            onClick={createNewItem}
            className="btn-pri col-span-full row-start-8"
          >
            Créer la nouvelle valeur
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default Add;
