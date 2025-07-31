import StandardDialog from "@/components/base/dialog/standard-dialog";
import StandardInput from "@/components/base/input/standard-input";
import StandardSelect from "@/components/base/input/standard-select";
import SuperSearch from "@/components/base/input/super-seach";
import Logo from "@/components/design/logo";
import MainBtn from "@/components/interface/btn/main-btn";
import StandardTemplate from "@/components/root/template/standard/standard-template";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function StandardForm({
  vehicule = false,
  add = true,
  initalInput = {},
  optionKey = "name",
  condition,
  children,
  btn,
  title,
  inputs = false,
  data = {},
  updateFunc,
  btntext = "Créer",
  // SECOND
  secondRoot = false,
  secondColumns = false,
  parentId = false,
  editId = false,
  fieldName = false,
  filterTable = false,
}) {
  const [input, setInput] = useState({ id: data?.id, ...initalInput });
  // console.log(initalInput, initalInput, inputs, "HELLWDUGSUYDGSUY");
  const router = useRouter();

  const mainFunc = () => {
    updateFunc(input);
    // router.reload();
  };

  const inputHandler = (field, value) => {
    const data = { ...input };
    // console.log(field,value,"40434850347594783")
    // Check if the current field exists and has no undefined values
    // if (data[field] && !Object.values(data[field]).includes(undefined)) {
      data[`${field}Id`] = value?.value || value;
      data[`${field}`] = value;
    // } 
    // else {
    //   data[`${field}Id`] = "";
    //   data[`${field}`] = {
    //     name: "",
    //     id: "",
    //   };
    // }

    // console.log(data,"----------------------------od[os");
    setInput(data);
  };

  // useEffect(() => {
  //   const newInput = { id: data?.id, ...initalInput };
  //   setInput(newInput);
  //   // console.log("hello", newInput );
  // }, [condition]);

  console.log(input,initalInput,12344);
  return (
    <StandardDialog
      state={condition}
      btn={btn}
      title={
        <div className="w-full bg-blue-500 h-28 absolute top-0 left-0  flex justify-end items-center p-4">
          <div className="absolute left-4">
            <Logo width={150} fill="white" />
          </div>
          <div className="text-white text-lg float-right">{title}</div>
        </div>
      }
    >
      <div className="w-[30vw] p-3 pt-24 grid gap-2 ">
        {inputs ? (
          <>
            {inputs.map((el, index) => {
              // console.log(input[el.field], el.field);
              return (
                <>
                  <StandardInput
                    key={index}
                    field={el.field}
                    onChange={(field, value) => {
                      setInput({ ...input, [field]: value });
                    }}
                    defaultValue={data[el.field]}
                    value={input[el.field]}
                    title={el.name}
                    type={el?.type || "text"}
                  />
                </>
              );
            })}
            {vehicule && (
              <SuperSearch
                value={{
                  name: input.Vehicule?.name || "",
                  id: input.Vehicule?.value || "",
                }}
                route={"vehicule"}
                field={"VehiculeId"}
                title={"Véhicule"}
                func={inputHandler}
              />
            )}
            <>
            {fieldName ? (
              Array.isArray(fieldName) ? (
                fieldName.map((field, index) => (
                  <StandardSelect
                    key={index}
                    add={add}
                    optionKey={optionKey}
                    name={field}
                    field={field}
                    route={field.toLowerCase()}
                    func={inputHandler}
                    value={
                      input[field] || {
                        name: "",
                        id: "",
                      }
                    }
                  />
                ))
              ) : (
                <StandardSelect
                  add={add}
                  optionKey={optionKey}
                  name={fieldName}
                  field={fieldName}
                  route={fieldName.toLowerCase()}
                  func={inputHandler}
                  value={
                    input[fieldName] || {
                      name: "",
                      id: "",
                    }
                  }
                />
              )
            ) : null}
          </>

            <>
              {secondRoot ? (
                <>
                  <StandardTemplate
                    searchOption={false}
                    columns={secondColumns}
                    root={secondRoot}
                    onCreateClick={true}
                    onDeleteClick={true}
                    panel={false}
                    option={true}
                    standardEdit={secondColumns}
                    parentId={parentId}
                    fieldName={filterTable}
                  />
                </>
              ) : (
                <></>
              )}
            </>
            <>{children}</>
          </>
        ) : (
          <>{children}</>
        )}
      </div>
      <div></div>
      <div className="col-span-full flex gap-2 justify-end items-center w-full ">
        <MainBtn func={mainFunc}>{btntext}</MainBtn>
      </div>
    </StandardDialog>
  );
}
