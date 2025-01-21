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
import axios from "axios";
import { serverUrl } from "../../../config/config";
import { downloadInvoice } from "../../../helpers/function.helper";

export default function Dashboard() {
  const queryClient = useQueryClient();

  const invoices = queryClient.getQueryData("invoices");
  const clients = queryClient.getQueryData("clients");

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

        <InvoicesTable invoices={invoices} clients={clients} />
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

const NewTableRow = ({ invoice = {}, clients = [] }) => {
  const queryClient = useQueryClient();
  const {
    _id: id,
    invoiceNumber = "0",
    date = Date.now(),
    clientId = null,
    totalHT = 0,
    TVA = 20,
    status = "En cours",
  } = invoice;

  const client = clients.find((client) => client.id === clientId) || {};
  const clientName = client.customerName || "";
  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const deleteInvoice = async (invoiceId) => {
    try {
      await axios.delete(`${serverUrl}/invoices/${invoiceId}`);
      queryClient.setQueryData("invoices", (oldData) => {
        if (!oldData) return [];
        return oldData.filter((invoice) => invoice._id !== invoiceId);
      });
    } catch (error) {
      console.error(
        "Error deleting invoice:",
        error.response?.data || error.message
      );
      alert("Failed to delete invoice. Please try again.");
    }
  };

  return (
    <TableRow key={id}>
      <TableCell>{invoiceNumber}</TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell>{clientName}</TableCell>
      <TableCell>{(totalHT * TVA) / 100}</TableCell>
      <TableCell>
        <p className={styles.percentage}>{status}</p>
      </TableCell>
      <TableCell>
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "flex-end",
          }}
        >
          <Box
            component="i"
            onClick={(e) => downloadInvoice(e, invoice, client)}
            className={`fi fi-rr-download ${styles.icon}`}
          />
          <Box
            component="i"
            onClick={() => deleteInvoice(id)}
            className={`fi fi-rr-trash ${styles.icon} ${styles.delete}`}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

const InvoicesTable = ({ invoices = [], clients = [] }) => {
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
            <NewTableRow invoice={invoice} clients={clients} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
