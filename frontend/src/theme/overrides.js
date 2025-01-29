import { createTheme } from "@mui/material";
import { palette } from "./palette";

export const overrides = createTheme({
  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
  components: {
    // * Button
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderRadius: "10px",
          width: "fit-content",
          height: "fit-content",
          padding: "8px 16px",
          // lineHeight: 1,
          textTransform: "none",
          fontFamily: "HelveticaNowText",
          backgroundColor: palette["warm-red"],
        },
        outlined: {
          backgroundColor: "transparent",
          color: "#353537",
          border: "1px solid #e8e9eb",
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
            gap: "8px",
            fontSize: "13px",
            borderRadius: "8px",
            height: "fit-content",
            backgroundColor: "#fff",
            border: "1px 0px 0px 0px",
            fontFamily: "HelveticaNowText",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontFamily: "HelveticaNowText", fontWeight: 300 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: palette["warm-red"],
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: palette["warm-red"],
          },
          "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
            borderColor: "#e8e9eb",
          },
        },
        notchedOutline: {
          borderColor: "#e8e9eb",
        },
        input: {
          padding: "8px 12px",
          "&.Mui-disabled": {
            WebkitTextFillColor: "#717680ff",
            backgroundColor: "#f8fafb",
          },
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
        flexContainer: {
          gap: "12px",
        },
        indicator: {
          width: 0,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          margin: 0,
          gap: "10px",
          minHeight: 0,
          lineHeight: 1,
          fontWeight: 500,
          fontSize: "13px",
          minWidth: "100px",
          textAlign: "left",
          color: "#474959",
          borderRadius: "8px",
          padding: "10px 14px",
          textTransform: "none",
          justifyContent: "left",
          alignItems: "flex-start",
          fontFamily: "HelveticaNowText",
          "&.Mui-selected": {
            color: palette["warm-red"],
            backgroundColor: "#fff",
            border: "1px solid #e8e9eb",
          },
        },
        icon: {
          marginRight: 0,
          display: "flex",
          alignItems: "center",
        },
      },
    },

    // * Autocomplete
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiFormControl-root": {
            "& .MuiInputBase-root": {
              padding: "8px 12px",
              paddingRight: "12px !important",
              "& .MuiInputBase-input": {
                padding: 0,
              },
            },
          },
        },
        popper: {
          "& .MuiPaper-root": {
            fontSize: "13px",
            marginTop: "6px",
            borderRadius: "8px",
            fontFamily: "inherit",
            boxShadow: "0px 0px 10px #00000017",
          },
        },
      },
    },

    // * Table
    MuiTable: {
      styleOverrides: {
        root: {
          margin: 0,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          padding: 0,
          backgroundColor: "#f6f8fa",
          "& :first-child": {
            borderRadius: "8px 0 0 8px",
          },
          "& :last-child": {
            borderRadius: "0 8px 8px 0",
          },
          "& .MuiTableCell-root": {
            borderBottom: 0,
            padding: "8px 12px",
            fontSize: "13px",
            color: "#9198a6",
            fontFamily: "inherit",
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          "& .MuiTableRow-root": {
            "&:last-child": {},
            "& .MuiTableCell-root": {
              fontSize: "13px",
              padding: "8px 12px",
              fontFamily: "inherit",
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #e8e9eb",
        },
      },
    },
  },
});
