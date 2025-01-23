import React, { useEffect, useState } from "react";
import { Tabs, Tab, Box, ThemeProvider, Divider } from "@mui/material";
import styles from "./Dashboard.module.scss";
import logo from "../../assets/images/logo.png";
import { overrides } from "../../theme/overrides";
import InvoicesList from "./invoice/invoices_list/InvoicesList";
import Invoice from "./invoice/create_invoice/Invoice";
import ClientList from "./client/clients_list/ClientList";
import Client from "./client/create_client/Client";

function Dashboard() {
  const [tabIndex, setTabIndex] = useState(0);
  const [invoiceToEdit, setInvoiceToEdit] = useState(null);
  const [clientToEdit, setClientToEdit] = useState(null);

  useEffect(() => {
    if (invoiceToEdit) {
      setTabIndex(0);
    }
  }, [invoiceToEdit]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box className={styles.dashboard}>
      <Box className={styles.sidebar}>
        <img src={logo} alt="RgiStudio" className={styles.logo} />

        <ThemeProvider theme={overrides}>
          <Tabs
            orientation="vertical"
            value={tabIndex}
            onChange={handleTabChange}
            className={styles.tabs}
          >
            <Tab
              label="Factures"
              icon={<i className="fi fi-rr-file-invoice-dollar" />}
              iconPosition="start"
            />
            <Tab
              label="Liste des factures"
              icon={<i className="fi fi-rr-receipt" />}
              iconPosition="start"
            />
            <Divider />
            <Tab
              label="Clients"
              icon={<i className="fi fi-rr-user-add" />}
              iconPosition="start"
            />
            <Tab
              label="Liste des clients"
              icon={<i className="fi fi-rr-users-alt" />}
              iconPosition="start"
            />
            {/*    <Tab
              label="Dashboard"
              icon={<i className="fi fi-rr-house-blank" />}
              iconPosition="start"
            />
            <Tab
              label="Fournisseurs"
              icon={<i className="fi fi-rr-shopping-bag" />}
              iconPosition="start"
            />
            <Tab
              label="Insights"
              icon={<i className="fi fi-rr-chart-pie" />}
              iconPosition="start"
            />
            <Tab
              label="Paramètres"
              icon={<i className="fi fi-rr-settings" />}
              iconPosition="start"
            /> */}
          </Tabs>
        </ThemeProvider>

        <div className={styles.container}>
          {/* <div className={styles.card}>
            <div className={styles.cardLeft}>
              <div className={styles.avatar} />
              <p>Mohamed Jdad</p>
            </div>
            <i className={`fi fi-rr-menu-dots-vertical ${styles.menuIcon}`} />
          </div> */}
          <p className={styles.footerText}>© 2025 RGI Studio</p>
        </div>
      </Box>

      {tabIndex === 0 && (
        <Box className={styles.content}>
          <Invoice
            invoiceToEdit={invoiceToEdit}
            setInvoiceToEdit={setInvoiceToEdit}
          />
        </Box>
      )}
      {tabIndex === 1 && (
        <Box className={styles.content}>
          <InvoicesList setInvoiceToEdit={setInvoiceToEdit} />
        </Box>
      )}
      {tabIndex === 3 && (
        <Box className={styles.content}>
          <Client />
        </Box>
      )}
      {tabIndex === 4 && (
        <Box className={styles.content}>
          <ClientList />
        </Box>
      )}
      {/* {tabIndex === 3 && (
        <Box className={styles.content}>
          <StatsDashboard />
        </Box>
      )} */}
    </Box>
  );
}

export default Dashboard;
