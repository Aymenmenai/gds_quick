import { create } from "zustand";

function generateSignal() {
  return crypto.randomUUID(); // or: Date.now().toString()
}

export const useStatus = create((set) => ({
  message: null,
  type: null,
  signal: "",

  setSuccess: (msg) =>
    set(() => ({
      message: msg,
      type: "success",
      signal: generateSignal(),
    })),

  setError: (msg) =>
    set(() => ({
      message: msg,
      type: "error",
      signal: generateSignal(),
    })),

  clear: () =>
    set(() => ({
      message: null,
      type: null,
      signal: "",
    })),
}));
