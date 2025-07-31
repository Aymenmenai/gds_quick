import React, { useState } from "react";

const Dialog = ({ children, target }) => {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const openDialog = () => setOpen(true);

  return (
    <>
      <span onClick={openDialog}>{target}</span>

      {/* Overlay */}
      {open && (
        <div
          onClick={close}
          className="bg-gray-600/30 fixed inset-0 z-40 transition-opacity duration-200 opacity-100"
        />
      )}

      {/* Dialog box */}
      {open && (
        <div className="p-5 bg-white min-w-[30svw]  max-h-[92vh] w-auto overflow-y-auto shadow-lg rounded-3xl z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200">
          {typeof children === "function" ? children({ close }) : children}
        </div>
      )}
    </>
  );
};

export default Dialog;
