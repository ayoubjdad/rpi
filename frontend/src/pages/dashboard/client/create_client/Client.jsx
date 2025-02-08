import React, { useState } from "react";
import styles from "./Client.module.scss";

import axios from "axios";
import { useQueryClient } from "react-query";

import { Button, TextField, ThemeProvider } from "@mui/material";

import { overrides } from "../../../../theme/overrides";
import { serverUrl } from "../../../../config/config";

const Client = () => {
  const queryClient = useQueryClient();

  const clients = queryClient.getQueryData("clients") || [];

  const initialClientValue = {
    id: "",
    ICE: "",
    customerName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      country: "",
    },
  };

  const [client, setClient] = useState({ ...initialClientValue });

  const saveClient = async (e) => {
    e?.preventDefault();

    try {
      const id = String(Math.random() * 10);
      await axios.post(`${serverUrl}/clients`, { ...client, id });
      queryClient.setQueriesData(["clients"], [...clients, client]);

      setClient({ ...initialClientValue });
      alert("Client enregistré avec succès");
    } catch (error) {
      console.error("❌ Error saving client:", error);
      alert("Erreur lors de l'enregistrement du client.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prevClient) => ({
      ...prevClient,
      [name]: value,
    }));
  };

  return (
    <ThemeProvider theme={overrides}>
      <div className={styles.main}>
        <div style={{ display: "grid", gap: "6px", height: "fit-content" }}>
          <h1 style={{ color: "#353537" }}>Clients</h1>
          <p style={{ color: "#a3acb9" }}>
            Consultez et gérez toutes vos factures en un seul endroit.
          </p>
        </div>

        <form onSubmit={saveClient} className={styles.form}>
          <h2 className={styles.secondTitle}>Ajouter un client</h2>
          <div style={{ display: "grid", gap: "12px" }}>
            <div className={styles.clientInfos}>
              <TextField
                placeholder="CustomerName"
                name="customerName"
                value={client.customerName}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                placeholder="ICE"
                name="ICE"
                value={client.ICE}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                placeholder="Email"
                name="email"
                value={client.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                placeholder="Phone"
                name="phone"
                value={client.phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
            </div>
            <div className={styles.address}>
              <TextField
                placeholder="Adresse"
                name="street"
                value={client.address.street}
                onChange={(e) =>
                  setClient((prevClient) => ({
                    ...prevClient,
                    address: { ...prevClient.address, street: e.target.value },
                  }))
                }
                fullWidth
                margin="normal"
                required
              />
              <TextField
                placeholder="Ville"
                name="city"
                value={client.address.city}
                onChange={(e) =>
                  setClient((prevClient) => ({
                    ...prevClient,
                    address: { ...prevClient.address, city: e.target.value },
                  }))
                }
                fullWidth
                margin="normal"
                required
              />
              <TextField
                placeholder="Pays"
                name="country"
                value={client.address.country}
                onChange={(e) =>
                  setClient((prevClient) => ({
                    ...prevClient,
                    address: { ...prevClient.address, country: e.target.value },
                  }))
                }
                fullWidth
                margin="normal"
                required
              />
            </div>
          </div>

          <div className={styles.bottom}>
            <Button type="submit" variant="contained">
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </ThemeProvider>
  );
};

export default Client;
