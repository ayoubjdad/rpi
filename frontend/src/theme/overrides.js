import { createTheme } from "@mui/material";

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
          borderRadius: "8px",
        },
      },
    },
  },
});
