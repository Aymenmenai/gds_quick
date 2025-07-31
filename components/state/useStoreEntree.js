import { create } from "zustand";

export const useStoreEntree = create((set) => ({
  entree: {},

  initializeEntree: (data) => {
    set(() => {
      return { entree: { ...data } };
    });
  },

  fillEntree: (index, data) => {
    set((state) => {
      const newEntree = { ...state.entree, [index]: data };
      return { entree: newEntree };
    });
  },

  emptyEntree: () => {
    set({ entree: {} });
  },
}));

export const useRef = create((set) => ({
  entree: {},

  fillEntree: (index, data) => {
    set((state) => {
      const newEntree = { ...state.entree, [index]: data };
      return { entree: newEntree };
    });
  },

  emptyEntree: () => {
    set({ entree: {} });
  },
}));

// CLEAN ENTREE
export const useStoreCleanEntree = create((set) => ({
  entree: {},

  fillEntree: (index, data) => {
    set((state) => {
      const newEntree = state.entree;
      newEntree[index] = data;
      // console.log(newEntree,index,data)
      return newEntree;
    });
  },
  cancelElement: (index) => {
    set((state) => {
      const { entree, ...newState } = state;
      const { [index]: removedElement, ...newEntree } = entree;
      return { ...newState, entree: newEntree };
    });
  },

  emptyEntree: () => {
    set({ entree: {} });
  },
}));

// GET ID TO GENERATE RLREFERENEE
export const useStoreRef = create((set) => ({
  ref: undefined,
  getRef: (id) => {
    set(() => {
      return { ref: id };
    });
  },
}));

// STORE ENTREES
export const useStoreEntrees = create((set) => ({
  entrees: [],
  setNewEntree: (entree) => {
    set((state) => {
      const newArr = [...state.entrees, entree];
      return { entrees: [...newArr] };
    });
  },
}));
