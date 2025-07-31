import useURL from "@/components/v2/core/useURL";
import { useEffect, useState } from "react";
import Dialog from "../../containers/dialog";

const Switch = ({ state, func }) => {
  return (
    <div
      onClick={func}
      className={`${
        !state && "grayscale"
      } w-12 h-7 p-1 bg-blue-400 rounded-full relative cursor-pointer`}
    >
      <div
        className={`${
          state ? "translate-x-full" : "translate-x-0"
        } size-5 bg-white rounded-full absolute`}
      ></div>
    </div>
  );
};

const Fields = () => {
  const { addField, request } = useURL((state) => state);

  const [fieldArr, setFieldArr] = useState(request.fields);

  const updateField = (fieldName) => {
    const newArr = fieldArr.map((field) =>
      field.field === fieldName ? { ...field, active: !field.active } : field
    );
    setFieldArr(newArr);
  };

  const fieldsHandler = () => {
    addField(fieldArr);
  };

  useEffect(() => {
    setFieldArr(request.fields);
  }, [request.fields]);

  return (
    <Dialog
      target={
        <div className="btn-r">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            className="h-6 w-6 stroke-blue-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
            />
          </svg>
        </div>
      }
    >
      <div className="text-lg font-semibold mb-2">Afficher les colonnes</div>

      <div className="grid grid-rows-5 gap-2">
        {fieldArr
          .filter((a) => a.field !== "id")
          .map((el, index) => (
            <div key={index} className="flex items-center gap-2">
              <Switch func={() => updateField(el.field)} state={el.active} />
              <div>{el.name}</div>
            </div>
          ))}
      </div>

      <button onClick={fieldsHandler} className="btn-pri mt-4">
        {"Faire la mise à jour"}
      </button>
    </Dialog>
  );
};

export default Fields;
