import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Button,
  TextField,
  Divider,
  ThemeProvider,
} from "@mui/material";
import styles from "./Dashboard.module.scss";
import Invoice from "../invoice/Invoice";
import { overrides } from "../../../theme/overrides";

function Dashboard() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box className={styles.dashboard}>
      <Box className={styles.sidebar}>
        <Typography variant="h6" className={styles.logo}>
          RGI Studio
        </Typography>
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

      <Box className={styles.content}>{tabIndex === 0 && <Invoice />}</Box>
    </Box>
  );
}

export default Dashboard;
