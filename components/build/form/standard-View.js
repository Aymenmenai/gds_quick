import StandardDialog from "@/components/base/dialog/standard-dialog";
import Wave from "@/components/design/animation/wave";
import Logo from "@/components/design/logo";
import React from "react";
import styles from "@/components/design/animation/wave.module.scss";

export default function StandardView({ title = "entree title???",data }) {
  return (
    <StandardDialog
      btn={<div className="bg-cyan-600">Hello</div>}
      title={
        <div className="bg-blue-500 overflow-hidden h-28 absolute top-0 left-0 w-full flex justify-end items-center p-4">
          {/* <div className={styles.wave1}></div>
          <div className={styles.wave2}></div>
          <div className={styles.wave3}></div> */}
          <div className="absolute  left-4">
            <Logo width={150} fill="white" />
          </div>
          <div className="text-white float-right">{title}</div>
        </div>
      }
    >
      <div className="pt-20">
        <div>jjd</div>
        <div>jjd</div>
      </div>
    </StandardDialog>
  );
}
