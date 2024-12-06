import React, { useState } from "react";
import { jsPDF } from "jspdf";
import styles from "./Invoice.module.scss";
import {
  TextField,
  Button,
  ThemeProvider,
  Dialog,
  Box,
  Autocomplete,
} from "@mui/material";
import { overrides } from "../../../theme/overrides";
import { prixEnLettres } from "../../../helpers/function.helper";
import { clients } from "../../../data/data";

const initialInvoiceValue = {
  invoiceId: Math.random(),
  invoiceNumber: "",
  date: "",
  client: {
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      country: "",
    },
  },
  items: [],
  totalHT: 0,
  TVA: 20,
  notes: "",
  status: "",
};

const Invoice = () => {
  const [invoice, setInvoice] = useState({
    ...initialInvoiceValue,
  });

  const [item, setItem] = useState({
    description: "",
    quantity: "",
    price: "",
  });

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const handleSave = (e) => {
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
    doc.text(`Nom: ${invoice?.client?.customerName}`, 20, 85);
    doc.text(`Adresse: ${invoice?.client?.address?.street}`, 20, 90);
    doc.text(`Téléphone: ${invoice?.client?.phone}`, 20, 95);

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
    doc.text(`Montant HT :`, 135, y);
    let totalHT = 0;
    invoice.items.forEach((item) => (totalHT += item.quantity * item.price));
    doc.text(`${totalHT} DH`, 175, y, {
      align: "center",
    });

    y += 7;
    doc.text("TVA : ", 135, y);
    doc.text(`${invoice?.TVA}%`, 175, y, { align: "center" });

    y += 7;
    doc.text(`Montant TTC :`, 135, y);
    const totalTTC = totalHT + (totalHT * invoice.TVA) / 100;
    doc.text(`${totalTTC.toFixed(2)} DH`, 175, y, { align: "center" });

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

    // Save PDF
    doc.save(`facture_${invoice?.invoiceNumber || "exemple"}.pdf`);
  };

  const totalHT = invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const totalTTC = totalHT * 1.2;
  // const totalEnLettres = prixEnLettres(totalHT * 1.2);

  return (
    <ThemeProvider theme={overrides}>
      <Popup open={open} handleClose={handleClose} selectClient={setInvoice} />

      <div className={styles.main}>
        <div className={styles.container}>
          {/* <h1>Create a new invoice</h1> */}

          <form onSubmit={handleSave}>
            <div className={styles.header}>
              <div className={styles.headerFrom}>
                <h2 className={styles.secondTitle}>From:</h2>

                <div className={styles.from}>
                  <div>RGI Print</div>
                  <div>19034 Verna Unions Apt. 164 - Honolulu, RI / 87535</div>
                  <div>+212 707-220-199</div>
                  <div>ICE: {clients[0].ICE}</div>
                </div>
              </div>

              <div className={styles.headerTo}>
                <div className={styles.headerToTop}>
                  <h2 className={styles.secondTitle}>To:</h2>
                  <Box
                    component="i"
                    className={`fi fi-rr-plus ${styles.addCustomer}`}
                    onClick={handleOpen}
                  />
                </div>

                {invoice?.client?.customerName && (
                  <div className={styles.from}>
                    <div>{invoice?.client?.customerName}</div>
                    <div>
                      {`${invoice?.client?.address.street}, ${invoice?.client?.address.city},  ${invoice?.client?.address.country}`}
                    </div>
                    <div>{invoice?.client?.phone}</div>
                    <div>ICE: {invoice?.client?.ICE}</div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.invoiceInfos}>
              <TextField
                label="Invoice Number"
                name="invoiceNumber"
                value={invoice.invoiceNumber}
                onChange={handleChange}
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
                  <TextField {...params} label="Status" />
                )}
              />
              <TextField
                label="Date"
                name="date"
                value={invoice.date}
                onChange={handleChange}
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
            </div>

            <h2 className={styles.secondTitle}>Details:</h2>

            <div className={styles.details}>
              <TextField
                label="Description"
                name="description"
                value={item.description}
                onChange={handleItemChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Quantity"
                name="quantity"
                value={item.quantity}
                onChange={handleItemChange}
                type="number"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Price"
                name="price"
                value={item.price}
                onChange={handleItemChange}
                type="number"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Total"
                name="totalPrice"
                value={Number(item.price * item.quantity)}
                type="number"
                fullWidth
                disabled
                margin="normal"
              />
            </div>

            <div className={styles.details}>
              <Button
                variant="contained"
                onClick={addItem}
                startIcon={<i className="fi fi-rr-plus-small" />}
              >
                Add Item
              </Button>
            </div>

            <h2 className={styles.secondTitle}>Items List:</h2>

            <div className={styles.itemsList}>
              {invoice.items.map((itm, index) => (
                <div key={index} className={styles.item}>
                  <TextField
                    disabled
                    label="Description"
                    name="description"
                    value={itm.description}
                    fullWidth
                  />
                  <TextField
                    disabled
                    label="Quantity"
                    name="quantity"
                    value={itm.quantity}
                    type="number"
                    fullWidth
                  />
                  <TextField
                    disabled
                    label="Price"
                    name="price"
                    value={itm.price}
                    type="number"
                    fullWidth
                  />
                  <TextField
                    disabled
                    label="Total"
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
                <p style={{ fontWeight: 700, fontSize: "16px" }}>Total TTC :</p>
                <p style={{ fontWeight: 700, fontSize: "16px" }}>
                  {totalTTC?.toFixed(2)} DH
                </p>
              </div>

              {/* <p style={{ fontWeight: 700, fontSize: "16px" }}>
                {totalEnLettres}
              </p> */}
            </div>

            <div className={styles.details}>
              <Button type="submit" variant="contained">
                Save as PDF
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ThemeProvider>
  );
};

const Popup = ({ open, handleClose, selectClient }) => {
  const onChange = (value) => {
    const client = clients.find((client) => client.customerName === value);
    selectClient((prev) => ({ ...prev, client }));
    handleClose();
  };
  return (
    <Dialog onClose={handleClose} open={open}>
      <div
        style={{
          gap: "12px",
          display: "grid",
        }}
      >
        <h3>Choisi un client</h3>
        <Autocomplete
          options={clients.map((client) => client.customerName)}
          onChange={(_, value) => onChange(value)}
          renderInput={(params) => <TextField {...params} label="Client" />}
        />
      </div>
    </Dialog>
  );
};

export default Invoice;
