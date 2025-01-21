import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ThemeProvider,
} from "@mui/material";
import React from "react";
import styles from "./InvoicesList.module.scss";
import { useQueryClient } from "react-query";
import { serverUrl } from "../../../../config/config";
import axios from "axios";
import { downloadInvoice } from "../../../../helpers/function.helper";
import { overrides } from "../../../../theme/overrides";
import ClientComponent from "../../../../components/client/ClientComponent";

export default function InvoicesList() {
  const queryClient = useQueryClient();

  const invoices = queryClient.getQueryData("invoices") || [];
  const clients = queryClient.getQueryData("clients") || {};

  return (
    <div className={styles.main}>
      <div style={{ display: "grid", gap: "6px", padding: "24px" }}>
        <h1 style={{ color: "#353537" }}>Liste des factures</h1>
        <p style={{ color: "#a3acb9" }}>
          Consultez et gérez toutes vos factures en un seul endroit.
        </p>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.table}>
          <ThemeProvider theme={overrides}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Date de paiement</TableCell>
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
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
}

const NewTableRow = ({ invoice = {}, clients = [] }) => {
  const queryClient = useQueryClient();
  const {
    _id: id,
    invoiceNumber = "0",
    date = Date.now(),
    paymentDate,
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

  const formattedPaymentDate = !paymentDate
    ? "-"
    : new Date(paymentDate).toLocaleDateString("fr-FR", {
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
      <TableCell>
        <ClientComponent clientName={clientName} />
      </TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell>{formattedPaymentDate}</TableCell>
      <TableCell>{(totalHT * TVA) / 100} Dh</TableCell>
      <TableCell>
        <p
          className={`${styles.status} ${
            status === "En cours"
              ? styles.yellow
              : status === "Payée"
              ? styles.green
              : styles.red
          }`}
        >
          {status}
        </p>
      </TableCell>
      <TableCell>
        <div
          style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
        >
          <Box
            component="i"
            onClick={(e) => downloadInvoice(e, invoice, client)}
            className={`fi fi-rr-pencil ${styles.icon}`}
          />
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
