import { create } from "zustand";

export const useStoreRef = create((set) => ({
  ref: {},

  initializeRef: (data) => {
    set(() => {
      return { ref: { ...data } };
    });
  },

  fillRef: (index, data) => {
    set((state) => {
      const newRef = { ...state.ref, [index]: data };
      return { ref: newRef };
    });
  },

  emptyRef: () => {
    set({ ref: {} });
  },
}));
