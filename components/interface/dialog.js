import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function DialogUI({
  text,
  children,
  func,
  extraFunc = () => {},
  extraData = "",
  icon = false,
  button = undefined,
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    extraFunc(extraData);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const add = () => {
    // console.log(func);
    func();
  };
  return (
    <div>
      <div
        className={`${
          icon
            ? text
            : "bg-slate-200 px-4 border border-gray-300 py-2 text-gray-500 "
        }  cursor-pointer   rounded-lg hover:scale-105 transition-all ease-in-out duration-200`}
        onClick={handleClickOpen}
      >
        {icon ? icon : text}
      </div>
      <Dialog
        className="rounded-lg"
        open={open}
        TransitionComponent={Transition}
        keepMounted
        maxWidth={"xl"}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{text}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {children}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          {button !== undefined ? (
            <>{button}</>
          ) : (
            <>
              <Button onClick={add}>Agree</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
