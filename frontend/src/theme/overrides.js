import { colors, createTheme } from "@mui/material";

export const overrides = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Blue
    },
    secondary: {
      main: "#d32f2f", // Red
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h4: {
      fontWeight: 700,
    },
  },
  components: {
    // * Button
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderRadius: "68px",
          width: "fit-content",
          padding: "10px 20px",
          textTransform: "none",
          fontFamily: "CircularStd",
          backgroundColor: "#111111",
        },
        outlined: {
          backgroundColor: "transparent",
          color: "#111111",
          border: "1px solid #111111",
        },
        startIcon: { i: { display: "flex" } },
        endIcon: { i: { display: "flex" } },
      },
    },

    // * TextField
    MuiTextField: {
      styleOverrides: {
        root: {
          margin: "10px 0",
          "& .MuiInputBase-root": {
            borderRadius: "8px",
            fontFamily: "CircularStd",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { fontFamily: "CircularStd", fontWeight: 300 } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "rgba(0, 0, 0, 0.23)",
        },
      },
    },

    // * Dialog
    MuiDialog: {
      styleOverrides: {
        paper: {
          margin: 0,
          padding: "24px",
          minWidth: "300px",
          borderRadius: "8px",
        },
      },
    },

    // * Tabs
    MuiTabs: {
      styleOverrides: {
        indicator: {
          width: 0,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          textAlign: "left",
          borderRadius: "8px",
          textTransform: "none",
          alignItems: "flex-start",
          fontFamily: "CircularStd",
          padding: "10px 20px",
          margin: "0 10px",
          minWidth: "100px",
          "&.Mui-selected": {
            color: "white",
            backgroundColor: "#6c8ccd",
          },
        },
      },
    },
  },
});
