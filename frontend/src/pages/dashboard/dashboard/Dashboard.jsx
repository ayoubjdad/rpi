import { ThemeProvider } from "@emotion/react";
import React from "react";
import styles from "./Dashboard.module.scss";
import { overrides } from "../../../theme/overrides";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useQueryClient } from "react-query";

export default function Dashboard() {
  const queryClient = useQueryClient();

  const invoices = queryClient.getQueryData("invoices");

  return (
    <ThemeProvider theme={overrides}>
      <div className={styles.main}>
        <div style={{ display: "grid", gap: "6px" }}>
          <h1 style={{ color: "#353537" }}>Factures</h1>
          <p style={{ color: "#a3acb9" }}>
            Gérez vos factures en un seul endroit.
          </p>
        </div>

        <div
          style={{
            gap: "20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Stat title="Total Balance" balance="2.435" percentage="26" />
          <Stat title="Total Saving" balance="3.375" percentage="-24" />
          <Stat title="Revenue" balance="1.652" percentage="26" />
          <Stat title="Credit" balance="1.023" percentage="-26" />
        </div>

        <InvoicesTable invoices={invoices} />
      </div>
    </ThemeProvider>
  );
}

const Stat = ({ title, balance, percentage }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p>{title}</p>
        <Box component="i" className="fi fi-br-menu-dots" />
      </div>

      <div className={styles.preview}>
        <h1 className={styles.balance}>
          {balance} <span>DH</span>
        </h1>

        <div className={styles.footer}>
          <p>vs last month</p>
          <p className={styles.percentage}>{percentage}%</p>
        </div>
      </div>
    </div>
  );
};

const NewTableRow = ({ invoice = {} }) => {
  const {
    id,
    invoiceNumber = "0",
    date = Date.now(),
    clientId = null,
    totalHT = 0,
    TVA = 20,
    status = "En cours",
  } = invoice;

  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <TableRow key={id}>
      <TableCell>{invoiceNumber}</TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell>{clientId}</TableCell>
      <TableCell>{(totalHT * TVA) / 100}</TableCell>
      <TableCell>{status}</TableCell>
      <TableCell>
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "flex-end",
          }}
        >
          {/* <Box
                  component="i"
                  className={`fi fi-rr-pencil ${styles.icon}`}
                /> */}
          <Box
            component="i"
            // onClick={() => deleteClient(client.id, client.customerName)}
            className={`fi fi-rr-trash ${styles.icon} ${styles.delete}`}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

const InvoicesTable = ({ invoices = [] }) => {
  return (
    <div className={styles.invoicesTable}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Numéro de facture</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Client</TableCell>
            <TableCell>Montant total</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => (
            <NewTableRow invoice={invoice} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
