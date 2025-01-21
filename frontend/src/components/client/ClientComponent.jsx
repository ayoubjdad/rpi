import React from "react";
import styles from "./ClientComponent.module.scss";

export default function ClientComponent({ clientName }) {
  const firstLetter = clientName.charAt(0).toUpperCase();

  return (
    <div className={styles.clientContainer}>
      <div className={styles.clientLetter}>{firstLetter}</div>
      {clientName}
    </div>
  );
}
