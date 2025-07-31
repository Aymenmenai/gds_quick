import { create } from "zustand";

export const useStoreDesignation = create((set) => ({
  designation: "",

  setDesignation: (newDesignation) => {
    set({ designation: newDesignation });
  },
}));
