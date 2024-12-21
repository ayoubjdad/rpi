import React, { useState } from "react";
import styles from "./Invoice.module.scss";

import axios from "axios";
import { jsPDF } from "jspdf";
import { useQuery } from "react-query";

import { Button, TextField, Autocomplete, ThemeProvider } from "@mui/material";

import { makeStyles } from "@mui/styles";

import { overrides } from "../../../theme/overrides";
import { prixEnLettres } from "../../../helpers/function.helper";
import { clients } from "../../../data/data";
import { serverUrl } from "../../../config/config";
import { palette } from "../../../theme/palette";

const initialInvoiceValue = {
  invoiceId: Math.random(),
  invoiceNumber: "",
  date: "",
  clientId: "",
  items: [],
  totalHT: 0,
  TVA: 20,
  notes: "",
  status: "",
};

const getInvoices = async () => {
  const response = await fetch(`${serverUrl}/invoices`);
  return response.json();
};

const options = {
  retry: false,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
};

const useStyles = makeStyles((theme) => ({
  addItem: {
    padding: "0px !important",
    backgroundColor: "transparent !important",
    "& .MuiButton-startIcon": {
      marginLeft: "0px !important",
    },
  },
}));

const Invoice = () => {
  const classes = useStyles();
  const { data: invoices } = useQuery("invoices", getInvoices, options);

  const [invoice, setInvoice] = useState({
    ...initialInvoiceValue,
  });

  const [item, setItem] = useState({
    description: "",
    quantity: "",
    price: "",
  });

  const [open, setOpen] = useState(false);

  const client = !invoice?.clientId
    ? null
    : clients.find((client) => client.id === invoice.clientId);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const saveInvoice = async (e) => {
    e?.preventDefault();

    try {
      const response = await axios.post(`${serverUrl}/invoices`, invoice);
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
      alert("Please fill in all item fields before adding.");
    }
  };

  const handleSaveAndDownload = (e) => {
    e.preventDefault();

    const doc = new jsPDF();

    // Title and Company Details
    doc.setFontSize(24);
    doc.text("RGI Print", 20, 20);

    // Company Information
    doc.setFontSize(10);
    doc.text("345 W Main", 20, 40);
    doc.text("Los Angeles, CA 14151", 20, 45);
    doc.text("P: 915-555-0195", 20, 50);
    doc.text("rgi.print@example.com", 20, 55);

    // Invoice Information
    doc.setFontSize(10);
    doc.text(`Numéro de facture: ${invoice?.invoiceNumber || "22"}`, 185, 40, {
      align: "right",
    });
    doc.text(`Date de facturation: ${invoice?.date || "2024-12-15"}`, 185, 45, {
      align: "right",
    });
    doc.text(`Motif: ${invoice?.notes || "Décoration florale"}`, 185, 50, {
      align: "right",
    });

    // Billing Details
    doc.setFontSize(12);
    doc.text("Facturé à:", 20, 80);
    doc.setFontSize(10);
    doc.text(`Nom: ${client?.customerName}`, 20, 85);
    doc.text(`Adresse: ${client?.address?.street}`, 20, 90);
    doc.text(`ICE: ${client?.ICE}`, 20, 95);

    // Table Headers
    let y = 120;
    doc.setFontSize(10);
    doc.setFillColor(200, 200, 200); // Light gray for the header row
    doc.rect(20, y, 170, 10, "F");
    doc.text("Description", 25, y + 7);
    doc.text("Quantité", 100, y + 7, { align: "center" });
    doc.text("Prix Unitaire (DH)", 130, y + 7, { align: "center" });
    doc.text("Prix Total (DH)", 180, y + 7, { align: "right" });

    // Table Items
    y += 16;
    invoice?.items.forEach((item, index) => {
      doc.text(item.description || "Description", 25, y);
      doc.text(String(item.quantity || 0), 100, y, { align: "center" });
      doc.text(`${Number(item.price)?.toFixed(2)}`, 130, y, {
        align: "center",
      });
      const price = Number(item.quantity) * Number(item.price);
      doc.text(`${Number(price)?.toFixed(2)}`, 180, y, { align: "right" });
      y += 10;
    });

    // Summary Section
    y += 10;
    doc.setFontSize(12);
    doc.text(`Montant HT :`, 20, y);
    let totalHT = 0;
    invoice.items.forEach((item) => (totalHT += item.quantity * item.price));
    doc.text(`${totalHT} DH`, 60, y);

    y += 7;
    doc.text("TVA : ", 20, y);
    doc.text(`${invoice?.TVA}%`, 60, y, { align: "left" });

    y += 7;
    doc.text(`Montant TTC :`, 20, y);
    const totalTTC = totalHT + (totalHT * invoice.TVA) / 100;
    doc.text(`${totalTTC.toFixed(2)} DH`, 60, y, { align: "left" });

    y += 7;
    const totalEnLettres = prixEnLettres(totalTTC);
    doc.text(totalEnLettres, 20, y, { align: "left" });

    // Footer Notes
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

    // * Save PDF
    // saveInvoice();
    doc.save(`facture_${invoice?.invoiceNumber || "exemple"}.pdf`);
  };

  const totalHT = invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const totalTTC = totalHT * 1.2;

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
            />
            <TextField
              placeholder="Date"
              name="date"
              value={invoice.date}
              onChange={handleChange}
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
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
              value={invoice.status}
              options={["Payée", "En cours", "Annulée"]}
              onChange={(_, value) =>
                setInvoice((prev) => ({ ...prev, status: value }))
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

          {!invoice.items?.length ? null : (
            <>
              <h2 className={styles.secondTitle}>Eléménts</h2>

              <div className={styles.itemsList}>
                {invoice.items.map((itm, index) => (
                  <div key={index} className={styles.details}>
                    <TextField
                      disabled
                      placeholder="Description"
                      name="description"
                      value={itm.description}
                      fullWidth
                    />
                    <TextField
                      disabled
                      placeholder="Quantity"
                      name="quantity"
                      value={itm.quantity}
                      type="number"
                      fullWidth
                    />
                    <TextField
                      disabled
                      placeholder="Price"
                      name="price"
                      value={itm.price}
                      type="number"
                      fullWidth
                    />
                    <TextField
                      disabled
                      placeholder="Total"
                      name="totalPrice"
                      value={Number(itm.price * itm.quantity)?.toFixed(2)}
                      type="number"
                      fullWidth
                    />
                  </div>
                ))}
              </div>

              <div className={styles.total}>
                <div className={styles.totalItem}>
                  <p className={styles.secondary}>Total HT : </p>
                  <p>{totalHT?.toFixed(2)} DH</p>
                </div>
                <div className={styles.totalItem}>
                  <p className={styles.secondary}>TVA : </p>
                  <p>20%</p>
                </div>
                <div className={styles.totalItem}>
                  <p style={{ fontWeight: 700, fontSize: "16px" }}>
                    Total TTC :
                  </p>
                  <p style={{ fontWeight: 700, fontSize: "16px" }}>
                    {totalTTC?.toFixed(2)} DH
                  </p>
                </div>
              </div>
            </>
          )}

          <div className={styles.buttons}>
            <Button onClick={saveInvoice} variant="outlined">
              Enregistrer
            </Button>

            <Button type="submit" variant="contained">
              Télécharger en PDF
            </Button>
          </div>
        </form>
        <InvoicePreview invoice={invoice} client={client} />
      </div>
    </ThemeProvider>
  );
};

const InvoicePreview = ({ invoice, client }) => {
  const totalHt = invoice?.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const totalTva = totalHt * 0.2;
  const totalTtc = totalHt * 1.2;
  const totalEnLettres = prixEnLettres(totalTtc);

  return (
    <div className={styles.invoicePreview}>
      <div className={styles.header}>
        <h2>RGI Print</h2>
        <div className={styles.invoiceNum}>
          <p className={styles.previewTitle}>Facture n°</p>
          <p>{invoice?.invoiceNumber || 1234}</p>
        </div>
        <div className={styles.clientInfos}>
          <p className={styles.previewTitle}>Facturé à:</p>
          <p>{client?.customerName || "John Doe"}</p>
          <p>{client?.address?.street || "123 Main Street"}</p>
          <p>ICE : {client?.ICE || "123456789"}</p>
        </div>
        <div className={styles.invoiceNum}>
          <p className={styles.previewTitle}>Date de facturation</p>
          <p>{invoice?.date || "2024-12-15"}</p>
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
          <p>{`${totalHt} DH`}</p>
        </div>

        <div className={styles.summaryItem}>
          <p className={styles.previewTitle}>TVA (20%)</p>
          <p>{`+ ${totalTva} DH`}</p>
        </div>

        <div className={styles.ttcGlobal}>
          <div className={styles.divider} />
          <div className={styles.ttc}>
            <p className={styles.previewTitle}>Montant TTC :</p>
            <p>{`${totalTtc} DH`}</p>
          </div>
        </div>

        <p style={{ fontWeight: 700, fontSize: "16px" }}>{totalEnLettres}</p>
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
