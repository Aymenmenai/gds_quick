import React from "react";
import styles from "./auth-input.module.scss";

export default function AuthInput({ placeholder, field, func, type = "text" }) {
  return (
    <input
      type={type}
      onChange={({ target }) => func(field, target.value)}
      className={styles.custominput}
      placeholder={placeholder}
    />
  );
}
