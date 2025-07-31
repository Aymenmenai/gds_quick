import { create } from "zustand";

export const useStoreVehicule = create((set) => ({
  vehicule: {},

  initializeVehicule: (data) => {
    set(() => {
      return { vehicule: { ...data } };
    });
  },

  fillVehicule: (index, data) => {
    set((state) => {
      const newVehicule = { ...state.vehicule, [index]: data };
      return { vehicule: newVehicule };
    });
  },

  emptyVehicule: () => {
    set({ vehicule: {} });
  },
}));




