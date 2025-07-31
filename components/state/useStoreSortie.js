import { create } from "zustand";

export const useStoreSortie = create((set) => ({
  sortie: {},

  initializeSortie: (data) => {
    set(() => {
      return { sortie: { ...data } };
    });
  },

  fillSortie: (index, data) => {
    set((state) => {
      const newSortie = { ...state.sortie, [index]: data };
      return { sortie: newSortie };
    });
  },
  cancelElement: (index) => {
    set((state) => {
      const { sortie, ...newState } = state;
      const { [index]: removedElement, ...newSortie } = sortie;
      //console.log(newSortie,'STATE');
      return { ...newState, sortie: newSortie };
    });
  },

  emptySortie: () => {
    set({ sortie: {} });
  },
}));

// AQS
export const useStoreAQS = create((set) => ({
  ids: [],
  selectedArr: (input) => {
    set((state) => {
      let i = state.ids;

      // console.log(input);
      if (i.find((a) => a.id === input.id)) {
        i.splice(i.indexOf(i.find((a) => a.id === input.id)), 1);
      } else {
        i.push({ ...input, currQuantity: 0 });
      }
      return i;
    });
  },

  editCurrQuantity: (index, data) => {
    set((state) => {
      let i = state.ids;
      i[index].currQuantity = data;
      return i;
    });
  },

  deleteAQS: (index) => {
    set((state) => {
      const AQS = state.ids.filter((i) => {
        if (i.id !== index) {
          return i;
        }
      });
      //console.log(AQS, "917766546");
      return { ids: AQS };
    });
  },

  emptyAQS: () => {
    set({ ids: [] });
  },
}));
