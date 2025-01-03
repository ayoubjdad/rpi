import React, { useState } from "react";
import { Tabs, Tab, Box, ThemeProvider } from "@mui/material";
import styles from "./Dashboard.module.scss";
import Invoice from "../invoice/Invoice";
import { overrides } from "../../../theme/overrides";
import Client from "../client/Client";
import logo from "../../../assets/images/logo.png";

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
            <Tab label="Factures" />
            <Tab label="Dashboard" />
            <Tab label="Clients" />
          </Tabs>
        </ThemeProvider>
      </Box>

      {tabIndex === 0 && (
        <Box className={styles.content}>
          <Invoice />
        </Box>
      )}
      {tabIndex === 2 && (
        <Box className={styles.content}>
          <Client />
        </Box>
      )}
    </Box>
  );
}

export default Dashboard;
