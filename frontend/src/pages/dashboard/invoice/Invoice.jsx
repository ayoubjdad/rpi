import React, { useState } from "react";
import styles from "./Invoice.module.scss";

import axios from "axios";
import { jsPDF } from "jspdf";
import { useQueryClient } from "react-query";

import {
  Box,
  Button,
  TextField,
  Autocomplete,
  ThemeProvider,
} from "@mui/material";

import { makeStyles } from "@mui/styles";

import { overrides } from "../../../theme/overrides";
import { prixEnLettres } from "../../../helpers/function.helper";
import { serverUrl } from "../../../config/config";

const useStyles = makeStyles((theme) => ({
  addItem: {
    color: "#3240fe !important",
    padding: "0px 24px !important",
    backgroundColor: "transparent !important",
    "& .MuiButton-startIcon": {
      marginLeft: "0px !important",
    },
  },
}));

const Invoice = () => {
  const classes = useStyles();
  const queryClient = useQueryClient();

  const clients = queryClient.getQueryData("clients");
  const invoices = queryClient.getQueryData("invoices");
  const invoiceNumber = invoices?.length + 1;

  const initialInvoiceValue = {
    invoiceId: Math.random(),
    invoiceNumber: invoiceNumber,
    date: "",
    clientId: "",
    items: [],
    totalHT: 0,
    TVA: 20,
    notes: "",
    status: "",
  };

  const [invoice, setInvoice] = useState({
    ...initialInvoiceValue,
  });

  const [item, setItem] = useState({
    description: "",
    quantity: "",
    price: "",
  });

  const client = !invoice?.clientId
    ? null
    : clients.find((client) => client.id === invoice.clientId);

  const clientsList =
    clients
      .filter((client) => client.customerName)
      .map((client) => ({
        label: client.customerName,
        id: client.id,
      })) || [];

  const saveInvoice = async (e) => {
    e?.preventDefault();

    try {
      const totalHT =
        invoice?.items.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        ) || 0;
      const totalTTC = totalHT * 1.2 || 0;

      const response = await axios.post(`${serverUrl}/invoices`, {
        ...invoice,
        totalHT,
        totalTTC,
      });
      queryClient.setQueriesData(["invoices"], (oldData) => [
        ...oldData,
        response.data,
      ]);
      console.log("Invoice saved successfully:", response.data);
    } catch (error) {
      console.error("❌ Error saving invoice:", error);
      throw error;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      [name]: value,
    }));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const addItem = () => {
    if (item.description && item.quantity && item.price) {
      setInvoice((prevInvoice) => ({
        ...prevInvoice,
        items: [...prevInvoice.items, item],
      }));
      setItem({ description: "", quantity: "", price: "" }); // Reset item input
    } else {
      alert(
        "Veuillez remplir tous les champs de l'article avant de l'ajouter."
      );
    }
  };

  const removeItem = (index) => {
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      items: prevInvoice.items.filter((_, i) => i !== index),
    }));
  };

  const getAddress = (address) => {
    if (!address) return "";

    const { street, city, country } = address;

    if (!street && !city && !country) return "";

    let result = "";

    if (street) {
      result += `${street}`;
    }

    if (city) {
      result += `, ${city}`;
    }

    if (country) {
      result += `, ${country}`;
    }

    return result;
  };

  const addressForm = getAddress(client?.address);

  const handleSaveAndDownload = (e) => {
    e.preventDefault();

    const doc = new jsPDF();

    doc.setFillColor(249, 250, 252);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.roundedRect(10, 10, 190, 58, 2, 2, "FD"); // FD = Fill and Draw

    // --- Invoice Title and Company Logo ---
    doc.setFontSize(24);
    doc.text("RGI Print", 17, 23); // Aligned with the image

    // --- Invoice Information (Right Aligned) ---
    doc.setFontSize(12);
    doc.setTextColor(143, 147, 167);
    doc.text(`Facture n°`, 193, 20, { align: "right" });
    doc.setTextColor(0, 0, 0);
    doc.text(`${invoice?.invoiceNumber || "22"}`, 193, 27, { align: "right" });

    doc.setTextColor(143, 147, 167);
    doc.text(`Date de facturation`, 193, 40, { align: "right" });
    doc.setTextColor(0, 0, 0);
    doc.text(`${invoice?.date || "2024-12-15"}`, 193, 47, { align: "right" });
    // doc.text(`Motif: ${invoice?.notes || "Décoration florale"}`, 193, 30, {
    //   align: "right",
    // });

    // --- Billing Details ---
    doc.setTextColor(143, 147, 167);
    doc.text("Facturé à", 17, 40);
    doc.setTextColor(0, 0, 0);
    doc.text(`${client?.customerName}`, 17, 47);
    doc.text(addressForm, 17, 54);
    doc.text(`ICE: ${client?.ICE}`, 17, addressForm ? 61 : 54);

    // --- Table Headers (Light Gray Background) ---
    const tableHeaderY = 80;

    doc.setDrawColor(229, 231, 235); // Light gray (e5e7eb)
    doc.setLineWidth(0.2); // 0.2 units for 1px equivalent in jsPDF
    doc.line(10, tableHeaderY + 10, 200, tableHeaderY + 10); // Draw the bottom border line

    // Set text color and add text
    doc.setTextColor(0, 0, 0); // Black text
    doc.text("Description", 10, tableHeaderY + 6);
    doc.text("Quantité", 95, tableHeaderY + 6);
    doc.text("Prix Unitaire", 125, tableHeaderY + 6);
    doc.text("Total", 200, tableHeaderY + 6, { align: "right" });

    // --- Table Items ---
    let tableY = tableHeaderY + 18;
    invoice?.items.forEach((item) => {
      doc.text(item.description || "Description", 10, tableY);
      doc.text(String(item.quantity || 0), 95, tableY);
      doc.text(`${Number(item.price)?.toFixed(2)}`, 125, tableY);
      const price = Number(item.quantity) * Number(item.price);
      doc.text(`${Number(price)?.toFixed(2)}`, 200, tableY, { align: "right" });
      tableY += 10;
    });

    doc.line(10, tableY, 200, tableY); // Draw the bottom border line
    tableY += 10;

    // --- Summary Section ---
    doc.setFontSize(12);

    const totalHt =
      invoice?.items
        .reduce((sum, item) => sum + item.quantity * item.price, 0)
        ?.toFixed(2) || 0.0;
    const totalTva = (totalHt * 0.2)?.toFixed(2) || 0.0;
    const totalTtc = (totalHt * 1.2)?.toFixed(2) || 0.0;
    const totalEnLettres = prixEnLettres(Number(totalTtc));

    doc.setTextColor(143, 147, 167);
    doc.text("Montant HT", 10, tableY + 10);
    doc.setTextColor(0, 0, 0);
    doc.text(`${totalHt}DH`, 200, tableY + 10, { align: "right" });

    doc.setTextColor(143, 147, 167);
    doc.text("TVA (20%)", 10, tableY + 17);
    doc.setTextColor(0, 0, 0);
    doc.text(`${totalTva}DH`, 200, tableY + 17, { align: "right" });

    doc.line(10, tableY + 29, 140, tableY + 29);

    doc.setFillColor(249, 250, 252);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.2); // 0.2 units for 1px equivalent in jsPDF

    doc.roundedRect(120, tableY + 24, 80, 10, 2, 2, "FD");

    doc.setTextColor(143, 147, 167);
    doc.text("Montant TTC", 125, tableY + 30.5);
    doc.setTextColor(0, 0, 0);
    doc.text(`${totalTtc}DH`, 195, tableY + 30.5, { align: "right" });

    doc.text(totalEnLettres, 200, tableY + 40, { align: "right" });

    // --- Footer Notes ---
    const footerY = 262; // Place footer at the bottom

    doc.setFillColor(249, 250, 252);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.roundedRect(10, footerY - 4, 190, 29, 2, 2, "FD"); // FD = Fill and Draw

    doc.setFontSize(10);
    doc.text(
      "Sté RGI Print SARL - Réalisation & Impression",
      105,
      footerY + 4,
      { align: "center" }
    );
    doc.text(
      "10, Rue Liberté appt 5 3e étage - Casablanca - Tél: 06 10 808 374 - Email: rgiprintz@gmail.com",
      105,
      footerY + 9,
      { align: "center" }
    );
    doc.text(
      "RC n°: 638905 - Patente n°: 3421129 - ICE: 003538988000084 - IF: 6604481",
      105,
      footerY + 14,
      { align: "center" }
    );
    doc.text(
      "Compte Bancaire Crédit du Maroc: 021 780 000023830047086 63",
      105,
      footerY + 19,
      { align: "center" }
    );

    // --- Save PDF ---
    // saveInvoice();
    doc.save(`facture_${invoice?.invoiceNumber || "exemple"}.pdf`);
  };

  return (
    <ThemeProvider theme={overrides}>
      <div className={styles.main}>
        <div style={{ display: "grid", gap: "6px", padding: "24px" }}>
          <h1 style={{ color: "#353537" }}>Factures</h1>
          <p style={{ color: "#a3acb9" }}>
            Consultez et gérez toutes vos factures en un seul endroit.
          </p>
        </div>

        <form onSubmit={handleSaveAndDownload} className={styles.form}>
          <div className={styles.section}>
            <h2 className={styles.secondTitle}>Facture infos</h2>
            <div className={styles.invoiceInfos}>
              <TextField
                placeholder="Numéro de facture"
                name="invoiceNumber"
                value={invoice.invoiceNumber}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                disabled
              />
              <TextField
                placeholder="Date"
                name="date"
                value={invoice.date}
                onChange={handleChange}
                type="date"
                fullWidth
                margin="normal"
                required
              />
              <Autocomplete
                value={invoice.status}
                options={["Payée", "En cours", "Annulée"]}
                onChange={(_, value) =>
                  setInvoice((prev) => ({ ...prev, status: value }))
                }
                renderInput={(params) => (
                  <TextField {...params} placeholder="Statut" />
                )}
              />
              <Autocomplete
                value={client?.customerName || ""}
                options={clientsList}
                onChange={(_, value) =>
                  setInvoice((prev) => ({ ...prev, clientId: value.id }))
                }
                renderInput={(params) => (
                  <TextField {...params} placeholder="Client" />
                )}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.secondTitle}>Add items</h2>
            <div className={styles.details}>
              <TextField
                placeholder="Description"
                name="description"
                value={item.description}
                onChange={handleItemChange}
                fullWidth
                margin="normal"
              />
              <TextField
                placeholder="Quantité"
                name="quantity"
                value={item.quantity}
                onChange={handleItemChange}
                type="number"
                min={0}
                fullWidth
                margin="normal"
              />
              <TextField
                placeholder="Prix Unitaire (DH)"
                name="price"
                value={item.price}
                onChange={handleItemChange}
                type="number"
                min={0}
                fullWidth
                margin="normal"
              />
              <TextField
                placeholder="Total (DH)"
                name="totalPrice"
                value={Number(item.price * item.quantity)}
                type="number"
                min={0}
                fullWidth
                disabled
                margin="normal"
              />
            </div>
          </div>

          <Button
            className={classes.addItem}
            onClick={addItem}
            startIcon={<i className="fi fi-rr-add" />}
          >
            Ajouter un élément
          </Button>

          {!invoice.items?.length ? null : (
            <div className={styles.section}>
              <h2 className={styles.secondTitle}>Eléménts</h2>
              <div className={styles.itemsList}>
                {invoice.items.map((itm, index) => (
                  <div
                    key={index}
                    className={`${styles.details} ${styles.detailsElements}`}
                  >
                    <TextField
                      disabled
                      placeholder="Description"
                      label="Description"
                      name="description"
                      value={itm.description}
                      fullWidth
                    />
                    <TextField
                      disabled
                      placeholder="Quantité"
                      label="Quantité"
                      name="quantity"
                      value={itm.quantity}
                      type="number"
                      fullWidth
                    />
                    <TextField
                      disabled
                      placeholder="Prix Unitaire"
                      label="Prix Unitaire"
                      name="price"
                      value={itm.price}
                      type="number"
                      fullWidth
                    />
                    <TextField
                      disabled
                      placeholder="Total"
                      label="Total"
                      name="totalPrice"
                      value={Number(itm.price * itm.quantity)?.toFixed(2)}
                      type="number"
                      fullWidth
                    />
                    <div className={styles.removeItemContainer}>
                      <Box
                        component="i"
                        className={`fi fi-rr-trash ${styles.removeItem}`}
                        onClick={() => removeItem(index)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.bottom}>
            <div className={styles.buttons}>
              <Button onClick={saveInvoice} variant="outlined">
                Enregistrer
              </Button>

              <Button type="submit" variant="contained">
                Télécharger en PDF
              </Button>
            </div>
          </div>
        </form>
        {/* <InvoicePreview
          invoice={invoice}
          client={client}
          addressForm={addressForm}
        /> */}
      </div>
    </ThemeProvider>
  );
};

const InvoicePreview = ({ invoice, client, addressForm }) => {
  const totalHt = invoice?.items
    .reduce((sum, item) => sum + item.quantity * item.price, 0)
    ?.toFixed(2);
  const totalTva = (totalHt * 0.2)?.toFixed(2);
  const totalTtc = (totalHt * 1.2)?.toFixed(2);
  const totalEnLettres = prixEnLettres(Number(totalTtc));

  return (
    <div className={styles.invoicePreview}>
      <div className={styles.header}>
        <h2>RGI Print</h2>
        <div className={styles.invoiceNum}>
          <p className={styles.previewTitle}>Facture n°</p>
          <p>{invoice?.invoiceNumber || "#"}</p>
        </div>
        <div className={styles.clientInfos}>
          <p className={styles.previewTitle}>Facturé à:</p>
          <p>{client?.customerName}</p>
          <p>{addressForm}</p>
          <p>ICE : {client?.ICE || "#"}</p>
        </div>
        <div className={styles.invoiceNum}>
          <p className={styles.previewTitle}>Date de facturation</p>
          <p>{invoice?.date || "----/--/--"}</p>
        </div>
      </div>

      <div className={styles.tableDetails}>
        <div className={styles.group}>
          <p>Déscription</p>
          <p>Quantité</p>
          <p>Prix Unitaire</p>
          <p>Total</p>
        </div>

        <div className={styles.divider} />

        {invoice?.items.map((item, index) => (
          <div key={index} className={styles.group}>
            <p>{item.description}</p>
            <p>{item.quantity}</p>
            <p>{item.price}</p>
            <p>{item.price * item.quantity}</p>
          </div>
        ))}
      </div>

      <div className={styles.divider} />

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <p className={styles.previewTitle}>Montant HT</p>
          <p>{`${totalHt}DH`}</p>
        </div>

        <div className={styles.summaryItem}>
          <p className={styles.previewTitle}>TVA (20%)</p>
          <p>{`+ ${totalTva}DH`}</p>
        </div>

        <div className={styles.ttcGlobal}>
          <div className={styles.divider} />
          <div className={styles.ttc}>
            <p className={styles.previewTitle}>Montant TTC :</p>
            <p>{`${totalTtc}DH`}</p>
          </div>
        </div>

        <p>{totalEnLettres}</p>
      </div>

      <div className={styles.footer}>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.Aut adipisci
          voluptate distinctio consectetur suscipit, quos facere voluptatibus
          nulla, ea debitis minus dolores.
        </p>
      </div>
    </div>
  );
};

export default Invoice;
