import { create } from "zustand";

export const useStoreFilter = create((set) => ({
  filters: [],

  initialFilter: (extra = false) => {
    set(() => {
      let d = { name: "", value: "" };
      let filters = extra ? [d, extra] : [d];
      filters = [...filters, { name: "date[lte]", value: "" }, { name: "date[gte]", value: "" }]
      return { filters };
    });
  },
  fillFilter: (key, index, data) => {
    set((state) => {
      const newFilters = state.filters.map((attr, i) =>
        i === key ? { ...attr, [index]: data } : attr
      );

      // console.log(key, index, data, newFilters);
      return { filters: newFilters };
    });
  },

  addFilter: (data = { name: "", value: "" }) => {
    set((state) => ({
      filters: [...state.filters, data],
    }));
  },

  deleteFilter: (index) => {
    set((state) => {
      const newFilters = state.filters.filter((_, i) => i !== index);
      return { filters: newFilters };
    });
  },

  modifyFilterName: (searchName, newName) => {
    set((state) => {
      const newFilters = state.filters.map((attr) =>
        attr.name === searchName ? { ...attr, name: newName } : attr
      );
      return { filters: newFilters };
    });
  },

  modifyFilterValue: (searchName, newValue) => {
    set((state) => {
      const newFilters = state.filters.map((attr) =>
        attr.name === searchName ? { ...attr, value: newValue } : attr
      );
      return { filters: newFilters };
    });
  },

  emptyFilter: () => {
    set({ filters: [] });
  },
}));
