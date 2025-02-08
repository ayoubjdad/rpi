import React, { useEffect, useState } from "react";
import styles from "./ClientList.module.scss";

import axios from "axios";
import { useQueryClient } from "react-query";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ThemeProvider,
} from "@mui/material";

import { overrides } from "../../../../theme/overrides";
import { serverUrl } from "../../../../config/config";
import ClientComponent from "../../../../components/client/ClientComponent";

const ClientList = () => {
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
  const [clientToEdit, setClientToEdit] = useState(null);

  useEffect(() => {
    if (clientToEdit) {
      setClient(clients.find((c) => c._id === clientToEdit));
    }
  }, [clientToEdit]);

  const saveClient = async (e) => {
    e?.preventDefault();

    try {
      if (clientToEdit) {
        const updatedClients = clients.map((c) =>
          c._id === clientToEdit ? client : c
        );
        await axios.put(`${serverUrl}/clients/${clientToEdit}`, { ...client });
        queryClient.setQueriesData("clients", updatedClients);
      } else {
        const id = String(Math.random() * 10);
        await axios.post(`${serverUrl}/clients`, { ...client, id });
        queryClient.setQueriesData(["clients"], [...clients, client]);

        setClient({ ...initialClientValue });
        alert("Client enregistré avec succès");
      }
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

  const deleteClient = async (client = {}) => {
    try {
      const { id, customerName } = client;

      if (!id) {
        alert("Client ID is missing. Unable to delete.");
        console.error("❌ Client ID is missing in the delete request.");
        return;
      }

      await axios.delete(`${serverUrl}/clients/${id}`);
      queryClient.setQueriesData(["clients"], () =>
        clients.filter((client) => client.id !== id)
      );

      alert(`${customerName} a été supprimé avec succès.`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Une erreur s'est produite.";
      alert(`Erreur : ${errorMessage}`);
      console.error("❌ Error deleting client:", error);
    }
  };

  return (
    <ThemeProvider theme={overrides}>
      <div className={styles.main}>
        <div style={{ display: "grid", gap: "6px", height: "fit-content" }}>
          <h1 style={{ color: "#353537" }}>Liste des clients</h1>
          <p style={{ color: "#a3acb9" }}>
            Consultez et gérez toutes vos factures en un seul endroit.
          </p>
        </div>

        <div className={styles.clientsTable}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
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
                    <ClientComponent clientName={client.customerName} />
                  </TableCell>
                  <TableCell>{client.ICE}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{getAddress(client.address)}</TableCell>
                  <TableCell>
                    <div className={styles.icons}>
                      {/* <Box
                        component="i"
                        onClick={() => setClientToEdit(client._id)}
                        className={`fi fi-rr-pencil ${styles.icon}`}
                      /> */}
                      <Box
                        component="i"
                        onClick={() => deleteClient(client)}
                        className={`fi fi-rr-trash ${styles.icon} ${styles.delete}`}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ClientList;
