import { create } from "zustand";

const arrWithoutDublicated = (arr) => {
  const idSet = new Set([]);

  arr.map((el) => {
    idSet.add(el);
  });

  return [...idSet];
};

const useStoreIds = create((set) => ({
  ids: [],
  selectedArr: (input) => {
    // console.log("HELLO FROM STORE", input);
    const ids = arrWithoutDublicated(input);
    set({ ids });
  },
}));

export default useStoreIds;
