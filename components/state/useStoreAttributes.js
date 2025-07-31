import { create } from "zustand";

export const useStoreAttributes = create((set) => ({
  attributes: [],

  setAttributeData: (data) => {
    set(() => {
      return { attributes: [...data] };
    });
  },

  fillAttribute: (key, index, data) => {
    set((state) => {
      const newAttributes = state.attributes.map((attr, i) =>
        i === key ? { ...attr, [index]: data } : attr
      );

      return { attributes: newAttributes };
    });
  },

  addAttribute: () => {
    set((state) => ({
      attributes: [...state.attributes, { name: "", value: "" }],
    }));
  },

  deleteAttribute: (index) => {
    set((state) => {
      const newAttributes = state.attributes.filter((_, i) => i !== index);
      return { attributes: newAttributes };
    });
  },

  modifyAttributeName: (index, newName) => {
    set((state) => {
      const newAttributes = state.attributes.map((attr, i) =>
        i === index ? { ...attr, name: newName } : attr
      );
      return { attributes: newAttributes };
    });
  },

  modifyAttributeValue: (index, newValue) => {
    set((state) => {
      const newAttributes = state.attributes.map((attr, i) =>
        i === index ? { ...attr, value: newValue } : attr
      );
      return { attributes: newAttributes };
    });
  },
  emptyAttribute: () => {
    set({ attributes: [] });
  },
}));
