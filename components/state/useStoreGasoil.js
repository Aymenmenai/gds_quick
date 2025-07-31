
import { create } from "zustand";

export const useStoresortieGasoil = create((set) => ({
  sortieGasoil: {},

  initializeSortieGasoil: (data) => {
    set(() => {
      return { sortieGasoil: { ...data } };
    });
  },

  fillSortieGasoil: (index, data) => {
    set((state) => {
      const newsortieGasoil = { ...state.sortieGasoil, [index]: data };
      return { sortieGasoil: newsortieGasoil };
    });
  },
  cancelElement: (index) => {
    set((state) => {
      const { sortieGasoil, ...newState } = state;
      const { [index]: removedElement, ...newsortieGasoil } = sortieGasoil;
      //console.log(newsortieGasoil,'STATE');
      return { ...newState, sortieGasoil: newsortieGasoil };
    });
  },

  emptySortieGasoil: () => {
    set({ sortieGasoil: {} });
  },
}));

// AQS
// export const useStoreAQS = create((set) => ({
//   ids: [],
//   selectedArr: (input) => {
//     set((state) => {
//       let i = state.ids;

//       // console.log(input);
//       if (i.find((a) => a.id === input.id)) {
//         i.splice(i.indexOf(i.find((a) => a.id === input.id)), 1);
//       } else {
//         i.push({ ...input, currQuantity: 0 });
//       }
//       return i;
//     });
//   },

//   editCurrQuantity: (index, data) => {
//     set((state) => {
//       let i = state.ids;
//       i[index].currQuantity = data;
//       return i;
//     });
//   },

//   deleteAQS: (index) => {
//     set((state) => {
//       const AQS = state.ids.filter((i) => {
//         if (i.id !== index) {
//           return i;
//         }
//       });
//       //console.log(AQS, "917766546");
//       return { ids: AQS };
//     });
//   },

//   emptyAQS: () => {
//     set({ ids: [] });
//   },
// }));
