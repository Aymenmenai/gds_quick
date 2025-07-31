import { create } from "zustand";

// Define the generateQueryString function before creating the store
const generateQueryString = (filters, sort, page) => {
  let queryString = "";

  if (page) queryString += `?page=${page}`;

  if (filters.length > 0) {
    // console.log(filters);
    filters.forEach((filter) => {
      if (filter.value && filter.value) {
        queryString += "&";
        queryString += `${filter.name}=${filter.value}`;
      }
    });
  }

  if (sort.length > 0) {
    queryString += "&";
    queryString += `sort=${sort.join(",")}`;
  }

  return queryString;
};

const initialState = {
  filters: [],
  sort: [],
  page: 1,
  clean: "",
};

export const useStoreApiFeatures = create((set) => ({
  ...initialState,

  addFilter: (filter) => {
    set((state) => {
      return {
        ...state,
        filters: filter,
        clean: generateQueryString(filter, state.sort, state.page),
      };
    }, true);
  },

  removeFilter: (key) => {
    set((state) => {
      const updatedFilters = state.filters.filter(
        (filter) => filter.key !== key
      );
      return {
        ...state,
        filters: updatedFilters,
        clean: generateQueryString(updatedFilters, state.sort, state.page),
      };
    }, true);
  },

  toggleSort: (key) => {
    set((state) => {
      const updatedSort = state.sort.includes(key)
        ? state.sort.map((s) => (s === key ? `-${key}` : s))
        : [...state.sort, key];
      return {
        ...state,
        sort: updatedSort,
        clean: generateQueryString(state.filters, updatedSort, state.page),
      };
    }, true);
  },

  setPage: (page) => {
    set(
      (state) => ({
        ...state,
        page,
        clean: generateQueryString(state.filters, state.sort, page),
      }),
      true
    );
  },

  reset: () => {
    set({ ...initialState, clean: "" }, true);
  },
}));
