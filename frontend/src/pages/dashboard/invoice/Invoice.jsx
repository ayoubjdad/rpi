import React, { useState } from "react";
import { jsPDF } from "jspdf";
import styles from "./Invoice.module.scss";
import { TextField, Button, ThemeProvider } from "@mui/material";
import { overrides } from "../../../theme/overrides";
import { prixEnLettres } from "../../../helpers/function.helper";

const initialInvoiceValue = {
  invoiceId: "",
  invoiceNumber: "",
  date: "",
  dueDate: "",
  billingDetails: {
    customerName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  },
  items: [
    // {
    //   description: "Wireless Mouse",
    //   quantity: 2,
    //   unitPrice: 25.0,
    //   taxRate: 10,
    //   total: 55.0,
    // },
  ],
  subTotal: 100.0,
  taxes: {
    taxRate: 10,
    taxAmount: 10.0,
  },
  total: 105.0,
  notes: "",
  status: "Pending",
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
    doc.setFontSize(16);
    doc.text("Invoice Details", 20, 20);

    doc.setFontSize(12);
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 20, 40);
    doc.text(`Date: ${invoice.date}`, 20, 50);
    doc.text(`Customer Name: ${invoice.customerName}`, 20, 60);

    // Add item details
    let y = 80;
    doc.text("Items:", 20, y);
    invoice.items.forEach((item, index) => {
      y += 10;
      doc.text(
        `${index + 1}. ${item.description} - Quantity: ${
          item.quantity
        }, Price: $${item.price}`,
        20,
        y
      );
    });

    // Add total amount
    const totalAmount = invoice.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    y += 20;
    doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 20, y);

    doc.save(`invoice_${invoice.invoiceNumber}.pdf`);

    setInvoice({ ...initialInvoiceValue });

    alert("Invoice saved as PDF!");
  };

  const totalHT = invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const totalTTC = totalHT * 1.2;
  const totalEnLettres = prixEnLettres(totalHT * 1.2);

  return (
    <ThemeProvider theme={overrides}>
      <div className={styles.main}>
        <div className={styles.container}>
          {/* <h1>Create a new invoice</h1> */}

          <form onSubmit={handleSave}>
            <div className={styles.header}>
              <div className={styles.headerFrom}>
                <h2 className={styles.secondTitle}>From:</h2>

                <div className={styles.from}>
                  <div>Rpi</div>
                  <div>19034 Verna Unions Apt. 164 - Honolulu, RI / 87535</div>
                  <div>+212 707-220-199</div>
                </div>
              </div>

              <div className={styles.headerTo}>
                <div className={styles.headerToTop}>
                  <h2 className={styles.secondTitle}>To:</h2>
                  <h2 className={styles.secondTitle}>+</h2>
                </div>

                <div className={styles.from}>
                  <div>{invoice.billingDetails.customerName}</div>
                  <div>{invoice.billingDetails.address.street}</div>
                  <div>{invoice.billingDetails.phone}</div>
                </div>
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
              <TextField
                label="Status"
                name="invoiceStatus"
                value={invoice.invoiceStatus}
                onChange={handleChange}
                fullWidth
                margin="normal"
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
              {/* <TextField
                label="Customer Name"
                name="customerName"
                value={invoice.customerName}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              /> */}
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
                    value={Number(itm.price * itm.quantity).toFixed(2)}
                    type="number"
                    fullWidth
                  />
                </div>
              ))}
            </div>

            <div className={styles.total}>
              <div className={styles.totalItem}>
                <p className={styles.secondary}>Total HT : </p>
                <p>{totalHT.toFixed(2)} DH</p>
              </div>
              <div className={styles.totalItem}>
                <p className={styles.secondary}>TVA : </p>
                <p>20%</p>
              </div>
              <div className={styles.totalItem}>
                <p style={{ fontWeight: 700, fontSize: "16px" }}>
                  Total TTC :{" "}
                </p>
                <p style={{ fontWeight: 700, fontSize: "16px" }}>
                  {totalTTC.toFixed(2)} DH
                </p>
              </div>

              <p style={{ fontWeight: 700, fontSize: "16px" }}>
                {totalEnLettres}
              </p>
            </div>
          </form>

          <Button type="submit" variant="contained">
            Save as PDF
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Invoice;
