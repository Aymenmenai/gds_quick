import { create } from "zustand";

export const useStoreSousFamily = create((set) => ({
  sousFamily: {},

  initializeSousFamily: (data) => {
    set(() => {
      return { sousFamily: { ...data } };
    });
  },

  fillSousFamily: (index, data) => {
    set((state) => {
      const newSousFamily = { ...state.sousFamily, [index]: data };
      return { sousFamily: newSousFamily };
    });
  },

  emptySousFamily: () => {
    set({ sousFamily: {} });
  },
}));
