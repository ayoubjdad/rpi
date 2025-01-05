import React, { useState } from "react";
import { Tabs, Tab, Box, ThemeProvider } from "@mui/material";
import styles from "./Dashboard.module.scss";
import logo from "../../assets/images/logo.png";
import { overrides } from "../../theme/overrides";
import Invoice from "./invoice/Invoice";
import Client from "./client/Client";
import StatsDashboard from "./dashboard/Dashboard";

function Dashboard() {
  const [tabIndex, setTabIndex] = useState(0);

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
              label="Clients"
              icon={<i className="fi fi-rr-users" />}
              iconPosition="start"
            />
            <Tab
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
            />
          </Tabs>
        </ThemeProvider>
      </Box>

      {tabIndex === 0 && (
        <Box className={styles.content}>
          <Invoice />
        </Box>
      )}
      {tabIndex === 1 && (
        <Box className={styles.content}>
          <Client />
        </Box>
      )}
      {tabIndex === 2 && (
        <Box className={styles.content}>
          <StatsDashboard />
        </Box>
      )}
    </Box>
  );
}

export default Dashboard;
