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
    // * Button
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderRadius: "8px",
          width: "fit-content",
          padding: "10px 16px",
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
          margin: 0,
          "& .MuiInputBase-root": {
            borderRadius: "8px",
            fontFamily: "CircularStd",
            backgroundColor: "#f9fafc",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { fontFamily: "CircularStd", fontWeight: 300 } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: "10px 12px",
        },
        notchedOutline: {
          borderColor: "#e0e0e0",
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
          margin: 0,
          minHeight: 0,
          fontWeight: 400,
          minWidth: "100px",
          textAlign: "left",
          borderRadius: "8px",
          padding: "14px 20px",
          textTransform: "none",
          alignItems: "flex-start",
          fontFamily: "CircularStd",
          "&.Mui-selected": {
            color: "white",
            backgroundColor: "#6c8ccd",
          },
        },
      },
    },

    // * Autocomplete
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiFormControl-root": {
            "& .MuiInputBase-root": {
              padding: "10px 12px",
              paddingRight: "12px !important",
              "& .MuiInputBase-input": {
                padding: 0,
              },
            },
          },
        },
      },
    },
  },
});
