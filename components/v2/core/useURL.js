import { create } from "zustand";
import { url, limit } from "@/components/v2/global/variable";

const useURL = create((set, get) => ({
  request: {
    url,
    route: "",
    page: 1,
    limit,
    sort: [],
    lte: [],
    gte: [],
    where: [],
    include: {},
    fields: [],
    MagazinId: [],
  },

  generateURL: () => {
    const { request } = get();
    const params = [];

    const append = (key, value) => {
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.push(`${key}=${encodeURIComponent(value.join(","))}`);
        }
      } else {
        params.push(`${key}=${encodeURIComponent(String(value))}`);
      }
    };

    append("MagazinId", request.MagazinId);

    if (Array.isArray(request.fields)) {
      const flatFields = request.fields
        .filter((f) => f.active && !f.is_nested)
        .map((f) => f.field);
      if (flatFields.length > 0) {
        append("fields", flatFields);
      }
    }

    request.gte?.forEach((v) => append(`${v.field}[gte]`, v.value));
    request.lte?.forEach((v) => append(`${v.field}[lte]`, v.value));

    request.where?.forEach((w) => {
      const val = Array.isArray(w.value) ? w.value.join(",") : w.value;
      append(w.name, String(val).replace(" ", "%"));
    });

    if (Array.isArray(request.sort) && request.sort.length > 0) {
      const sortStr = request.sort.map(
        (el) => `${el.is_desc ? "-" : ""}${el.name}`
      );
      append("sort", sortStr);
    }

    append("page", request.page);
    append("limit", request.limit);

    const generatedUrl = `${url}${request.route}?${params.join("&")}`;

    set({ request: { ...request, url: generatedUrl } });
  },

  init: (api) => {
    const curr = { ...get().request, ...api };
    set({ request: curr });
    get().generateURL();
  },

  updateRoute: (route) => {
    const state = get().request;
    set({
      request: {
        ...state,
        route,
        page: 1,
        sort: [],
        gte: [],
        lte: [],
        fields: [],
        where: [],
        include: {},
        url,
      },
    });
    get().generateURL();
  },

  updatePage: (page) => {
    set((state) => ({ request: { ...state.request, page } }));
    get().generateURL();
  },

  addField: (fields) => {
    set((state) => ({ request: { ...state.request, fields } }));
    get().generateURL();
  },

  addWhere: (name, value) => {
    set((state) => ({
      request: {
        ...state.request,
        where: [
          ...state.request.where.filter((w) => w.name !== name),
          { name, value },
        ],
      },
    }));
    get().generateURL();
  },

  removeWhere: (index) =>
    set((state) => ({
      request: {
        ...state.request,
        where: state.request.where.filter((_, i) => i !== index),
      },
    })),

  emptyWhere: (where) => {
    set((state) => ({
      request: {
        ...state.request,
        where,
      },
    }));
  },

  addGTE: (name, value) =>
    set((state) => {
      const gte = state.request.gte.filter((g) => g.field !== name);
      if (value !== null) gte.push({ field: name, value });
      return { request: { ...state.request, gte } };
    }),

  addLTE: (name, value) =>
    set((state) => {
      const lte = state.request.lte.filter((l) => l.field !== name);
      if (value !== null) lte.push({ field: name, value });
      return { request: { ...state.request, lte } };
    }),

  addSort: (sorts) => {
    set((state) => ({ request: { ...state.request, sort: sorts } }));
    get().generateURL();
  },

  addMagazin: (arr) => {
    set((state) => ({ request: { ...state.request, MagazinId: arr } }));
    get().generateURL();
  },
}));

export default useURL;
