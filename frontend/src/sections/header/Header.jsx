import React from "react";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <span>RPI</span>
        <div className={styles.menu}>
          <span>Menu</span>
          <span>Menu</span>
          <span>Menu</span>
          <span>Menu</span>
          <span className={styles.button}>Clique ici</span>
        </div>
      </div>
    </div>
  );
}
