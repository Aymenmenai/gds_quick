import { create } from "zustand";

const useSubmitStore = create((set) => ({
  articles: [],
  onSubmit: (func) => {
    const at = func();
    set({ articles: at });
  },
}));

const useEntreeStore = create((set) => ({
  entree: [],
  entreeUpdate: "",
  entreeAdd: "",
  entreeEdit: "",
  selectedArr: (input) => {
    // console.log("HELLO FROM STORE", input);
    const ids = arrWithoutDublicated(input);
    set({ ids });
  },
}));
// CREATE A NEW ARTICLE
// VIEW ARTICLE
// EDIT ARTICLE
// ADD ARTICLE

// const arrWithoutDublicated = (arr) => {
//   const idSet = new Set([]);

//   arr.map((el) => {
//     idSet.add(el);
//   });

//   return [...idSet];
// };

// const useStoreIds = create((set) => ({
//   ids: [],
//   selectedArr: (input) => {
//     // console.log("HELLO FROM STORE", input);
//     const ids = arrWithoutDublicated(input);
//     set({ ids });
//   },
// }));

// export default useStoreIds;
