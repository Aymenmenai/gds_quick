export const catchAsync = (fn) => {
  return (...args) => {
    fn(...args).catch((err) => {
      console.error("⚠️ Caught error in async function:", err);
    });
  };
};
