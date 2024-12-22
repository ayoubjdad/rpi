import React, { useState } from "react";
import styles from "./Invoice.module.scss";

import axios from "axios";
import { jsPDF } from "jspdf";
import { useQueryClient } from "react-query";

import {
  Button,
  TextField,
  Autocomplete,
  ThemeProvider,
  Box,
} from "@mui/material";

import { makeStyles } from "@mui/styles";

import { overrides } from "../../../theme/overrides";
import { prixEnLettres } from "../../../helpers/function.helper";
import { serverUrl } from "../../../config/config";
import { palette } from "../../../theme/palette";

const useStyles = makeStyles((theme) => ({
  addItem: {
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
    items: [
      { description: "Déscription", quantity: 1, price: 10 },
      { description: "Déscription", quantity: 1, price: 10 },
      { description: "Déscription", quantity: 1, price: 10 },
    ],
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
    clients.map((client) => ({
      label: client.customerName,
      id: client.id,
    })) || [];

  const saveInvoice = async (e) => {
    e?.preventDefault();

    try {
      const response = await axios.post(`${serverUrl}/invoices`, invoice);
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

  const handleSaveAndDownload = (e) => {
    e.preventDefault();

    const doc = new jsPDF();

    // --- Invoice Title and Company Logo ---
    doc.setFontSize(24);
    doc.text("RGI Print", 20, 20); // Aligned with the image

    // --- Invoice Information (Right Aligned) ---
    doc.setFontSize(10);
    doc.text(`Facture n°: ${invoice?.invoiceNumber || "22"}`, 185, 40, {
      align: "right",
    });
    doc.text(`Date de facturation: ${invoice?.date || "2024-12-15"}`, 185, 45, {
      align: "right",
    });
    doc.text(`Motif: ${invoice?.notes || "Décoration florale"}`, 185, 50, {
      align: "right",
    });

    // --- Billing Details ---
    doc.setFontSize(12);
    doc.text("Facturé à:", 20, 80);
    doc.setFontSize(10);
    doc.text(`Nom: ${client?.customerName}`, 20, 85);
    doc.text(`Adresse: ${client?.address?.street}`, 20, 90);
    doc.text(`ICE: ${client?.ICE}`, 20, 95);

    // --- Table Headers (Light Gray Background) ---
    const tableHeaderY = 120;
    doc.setFillColor(200, 200, 200); // Light gray
    doc.rect(20, tableHeaderY, 170, 10, "F");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Black text on gray background
    doc.text("Description", 25, tableHeaderY + 7);
    doc.text("Quantité", 100, tableHeaderY + 7, { align: "center" });
    doc.text("Prix Unitaire (DH)", 130, tableHeaderY + 7, { align: "center" });
    doc.text("Prix Total (DH)", 180, tableHeaderY + 7, { align: "right" });

    // --- Table Items ---
    let tableY = tableHeaderY + 16;
    invoice?.items.forEach((item) => {
      doc.text(item.description || "Description", 25, tableY);
      doc.text(String(item.quantity || 0), 100, tableY, { align: "center" });
      doc.text(`${Number(item.price)?.toFixed(2)}`, 130, tableY, {
        align: "center",
      });
      const price = Number(item.quantity) * Number(item.price);
      doc.text(`${Number(price)?.toFixed(2)}`, 180, tableY, { align: "right" });
      tableY += 10;
    });

    // --- Summary Section ---
    doc.setFontSize(12);
    doc.text("Montant HT :", 20, tableY + 10);
    let totalHT = 0;
    invoice.items.forEach((item) => (totalHT += item.quantity * item.price));
    doc.text(`${totalHT} DH`, 60, tableY + 10);

    doc.text("TVA :", 20, tableY + 17);
    doc.text(`${invoice?.TVA}%`, 60, tableY + 17, { align: "left" });

    doc.text("Montant TTC :", 20, tableY + 24);
    const totalTTC = totalHT + (totalHT * invoice.TVA) / 100;
    doc.text(`${totalTTC.toFixed(2)} DH`, 60, tableY + 24, { align: "left" });

    doc.text(
      "six-cent-quatre-vingt-cinq dirhams et vingt centimes",
      20,
      tableY + 31,
      { align: "left" }
    ); // Example

    // --- Footer Notes ---
    const footerY = 275; // Place footer at the bottom
    doc.setFontSize(10);
    doc.text(
      "Veuillez libeller tous les chèques à l'ordre de RGI Print.",
      105,
      footerY,
      { align: "center" }
    );
    doc.text(
      "Paiement total dû sous 90 jours. Comptes en retard soumis à des frais de service de 1,5% par mois.",
      105,
      footerY + 5,
      { align: "center" }
    );
    doc.text(
      "rgi.print@example.com | www.siteinteressant.com",
      105,
      footerY + 10,
      { align: "center" }
    );

    // --- Save PDF ---
    doc.save(`facture_${invoice?.invoiceNumber || "exemple"}.pdf`);
  };

  return (
    <ThemeProvider theme={overrides}>
      <div className={styles.main}>
        <form onSubmit={handleSaveAndDownload} className={styles.form}>
          <Link />
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

          <h2 className={styles.secondTitle}>Add items</h2>
          <div className={styles.details}>
            <TextField
              placeholder="Déscription"
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
              fullWidth
              margin="normal"
            />
            <TextField
              placeholder="Prix Unitaire (DH)"
              name="price"
              value={item.price}
              onChange={handleItemChange}
              type="number"
              fullWidth
              margin="normal"
            />
            <TextField
              placeholder="Total (DH)"
              name="totalPrice"
              value={Number(item.price * item.quantity)}
              type="number"
              fullWidth
              disabled
              margin="normal"
            />
          </div>

          <Button
            className={classes.addItem}
            onClick={addItem}
            startIcon={<i className="fi fi-rr-add" />}
          >
            Ajouter un élément
          </Button>

          <h2 className={styles.secondTitle}>Eléménts</h2>

          {!invoice.items?.length ? null : (
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
                  <Box
                    component="i"
                    className={`fi fi-rr-trash ${styles.removeItem}`}
                    onClick={() => removeItem(index)}
                  />
                </div>
              ))}
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
        <InvoicePreview invoice={invoice} client={client} />
      </div>
    </ThemeProvider>
  );
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

const InvoicePreview = ({ invoice, client }) => {
  const totalHt = invoice?.items
    .reduce((sum, item) => sum + item.quantity * item.price, 0)
    ?.toFixed(2);
  const totalTva = (totalHt * 0.2)?.toFixed(2);
  const totalTtc = (totalHt * 1.2)?.toFixed(2);
  const totalEnLettres = prixEnLettres(Number(totalTtc));

  const addressForm = getAddress(client?.address);

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

const Link = () => {
  return (
    <div className={styles.link}>
      <p>All invoices</p>
      <i class="fi fi-rr-angle-small-right" />
      <p style={{ color: palette["darkest-gray"] }}>Create new invoice</p>
    </div>
  );
};

export default Invoice;
