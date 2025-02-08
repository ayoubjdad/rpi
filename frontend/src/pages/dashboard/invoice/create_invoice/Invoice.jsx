import React, { useMemo, useState } from "react";
import styles from "./Invoice.module.scss";

import axios from "axios";
import { useQueryClient } from "react-query";

import {
  Box,
  Button,
  TextField,
  Autocomplete,
  ThemeProvider,
} from "@mui/material";

import { makeStyles } from "@mui/styles";

import { overrides } from "../../../../theme/overrides";
import { downloadInvoice } from "../../../../helpers/function.helper";
import { serverUrl } from "../../../../config/config";
import { palette } from "../../../../theme/palette";

const useStyles = makeStyles((theme) => ({
  addItem: {
    color: `${palette["warm-red"]} !important`,
    padding: "0px 24px !important",
    backgroundColor: "transparent !important",
    "& .MuiButton-startIcon": {
      marginLeft: "0px !important",
    },
  },
}));

const Invoice = ({ invoiceToEdit, setInvoiceToEdit }) => {
  const classes = useStyles();
  const queryClient = useQueryClient();

  const clients = queryClient.getQueryData("clients") || [];
  const invoices = queryClient.getQueryData("invoices") || [];
  const invoiceNumber =
    (invoices?.[invoices.length - 1]?.invoiceNumber || 0) + 1;

  const initialInvoiceValue = useMemo(() => {
    if (invoiceToEdit) {
      return invoices.find((inv) => inv._id === invoiceToEdit);
    }

    return {
      id: String(Math.random()),
      invoiceNumber: invoiceNumber,
      billingDate: "",
      paymentDate: "",
      clientId: "",
      items: [],
      totalHT: 0,
      TVA: 20,
      notes: "",
      status: "",
    };
  }, [invoiceToEdit]);

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

      alert("Enregistrement réussi");
      setInvoice({ ...initialInvoiceValue, invoiceNumber: invoiceNumber + 1 });
    } catch (error) {
      console.error("❌ Error saving invoice:", error);
      throw error;
    }
  };

  const editInvoice = async (e) => {
    e?.preventDefault();

    try {
      const totalHT =
        invoice?.items.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        ) || 0;
      const totalTTC = totalHT * 1.2 || 0;

      const response = await axios.put(`${serverUrl}/invoices/${invoice._id}`, {
        ...invoice,
        totalHT,
        totalTTC,
      });

      queryClient.setQueriesData(["invoices"], (oldData) =>
        oldData.map((inv) =>
          inv.id === response.data.id ? response.data : inv
        )
      );

      alert("Modification réussie");
      setInvoiceToEdit(null);
    } catch (error) {
      console.error("❌ Error editing invoice:", error);
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

  const onSubmit = (e) => {
    saveInvoice(e);
    downloadInvoice(e, invoice, client);
    setInvoice({ ...initialInvoiceValue });
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

        <form onSubmit={onSubmit} className={styles.form}>
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
                placeholder="Date de facturation"
                helperText="Date de facturation"
                name="billingDate"
                value={invoice.billingDate}
                onChange={handleChange}
                type="date"
                fullWidth
                margin="normal"
                required
              />
              <TextField
                placeholder="Date de paiement"
                helperText="Date de paiement"
                name="paymentDate"
                value={invoice.paymentDate}
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
              <Button
                onClick={invoiceToEdit ? editInvoice : saveInvoice}
                variant="outlined"
              >
                {invoiceToEdit ? "Modifier" : "Enregistrer"}
              </Button>

              <Button type="submit" variant="contained">
                {`${
                  invoiceToEdit ? "Modifier" : "Enregistrer"
                } & Télécharger en PDF`}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </ThemeProvider>
  );
};

export default Invoice;
