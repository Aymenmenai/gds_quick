import React, { useEffect, useState } from "react";
import styles from "./bar.module.scss";

export default function Responsebar({ isLoading = false, isError = false }) {
  const [message, setMessage] = useState("Loading please");
  const [color, setColor] = useState("gray");

  const stateHandler = (color, message) => {
    setMessage(message);
    setColor(color);
  };

  useEffect(() => {
    isLoading
      ? stateHandler("gray", "Chargement en cours...")
      : isError
      ? stateHandler("#CB4736", "Une erreur s'est produite.")
      : stateHandler("#3DB74A", "La requête a réussi.");
  }, [isError, isLoading]);

  // const message = isLoading ? 'isLoading' : {
  //     isError ? 'Something went wrong' : 'request success'
  // }
  // GREEN #3DB74A
  // YELLOW  #E5CC45
  // RED #CB4736
  // NEURAL "gray"
  return (
    <div
      style={{ background: color }}
      className={styles.bar}
      // className='transition-all ease-in-out duration-300 fixed z-[999] top-0 left-0 w-screen py-2 shadow-lg text-white font-bold flex justify-center items-center'
    >
      {message}
    </div>
  );
}
