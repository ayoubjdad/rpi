import React, { useState } from "react";
import styles from "./Client.module.scss";

import axios from "axios";
import { useQueryClient } from "react-query";

import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
} from "@mui/material";

import { overrides } from "../../../theme/overrides";
import { serverUrl } from "../../../config/config";

const Client = () => {
  const queryClient = useQueryClient();

  const clients = queryClient.getQueryData("clients");
  const clientId = String(clients?.length + 1);

  const initialClientValue = {
    id: clientId,
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

  const [client, setClient] = useState({
    ...initialClientValue,
  });

  const saveClient = async (e) => {
    e?.preventDefault();

    try {
      await axios.post(`${serverUrl}/clients`, client);
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
        <div style={{ display: "grid", gap: "6px" }}>
          <h1 style={{ color: "#353537" }}>Factures</h1>
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

        <h2 className={styles.secondTitle}>Liste des clients</h2>
        <ClientsTable clients={clients} />
      </div>
    </ThemeProvider>
  );
};

const ClientsTable = ({ clients = [] }) => {
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

  const deleteClient = async (id, customerName) => {
    try {
      await axios.delete(`/clients/${id}`);
      alert(`${customerName} a été supprimé avec succès.`);
    } catch (error) {
      alert(`Erreur`);
      console.error("❌ Error deleting client:", error);
    }
  };

  return (
    <div className={styles.clientsTable}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Client</TableCell>
            <TableCell />
            <TableCell>ICE</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Téléphone</TableCell>
            <TableCell>Adresse</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <div
                  style={{
                    backgroundColor: "#f6f8fa",
                    height: "36px",
                    width: "36px",
                    borderRadius: "50%",
                  }}
                />
              </TableCell>
              <TableCell>{client.customerName}</TableCell>
              <TableCell>{client.ICE}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{getAddress(client.address)}</TableCell>
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
                    onClick={() => deleteClient(client.id, client.customerName)}
                    className={`fi fi-rr-trash ${styles.icon} ${styles.delete}`}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Client;
