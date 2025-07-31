import { create } from "zustand";

export const useStoreArticle = create((set) => ({
  article: {price:0},

  setArticleData: (data) => {
    set(() => {
      return { article: { ...data } };
    });
  },

  fillArticle: (index, data) => {
    set((state) => {
      const newArticle = { ...state.article, [index]: data };
      return { article: newArticle };
    });
  },

  removeElement: (index) => {
    set((state) => {
      const { article, ...newState } = state;
      const { [index]: removedElement, ...newArticle } = article;
      return { ...newState, article: newArticle };
    });
  },

  emptyArticle: () => {
    set({ article: {} });
  },
}));
