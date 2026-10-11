"use client";

import { createTheme } from "@mui/material/styles";

export const adminTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#174c3a", // Nivaroa deep pine
      light: "#266952",
      dark: "#0f3327",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#c28835", // Warm bronze/amber
      light: "#dca556",
      dark: "#966520",
      contrastText: "#ffffff",
    },
    success: {
      main: "#2e7d32",
      light: "#e8f5e9",
      dark: "#1b5e20",
    },
    warning: {
      main: "#ed6c02",
      light: "#fff3e0",
      dark: "#e65100",
    },
    error: {
      main: "#d32f2f",
      light: "#ffebee",
      dark: "#c62828",
    },
    info: {
      main: "#0288d1",
      light: "#e1f5fe",
      dark: "#01579b",
    },
    background: {
      default: "#f7f8f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#192b21",
      secondary: "#647469",
    },
    divider: "#e8ebe5",
  },
  typography: {
    fontFamily:
      "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
      color: "#192b21",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.015em",
      color: "#192b21",
    },
    h6: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
      color: "#192b21",
    },
    subtitle1: {
      fontWeight: 500,
      color: "#48594e",
    },
    subtitle2: {
      fontWeight: 600,
      color: "#647469",
    },
    body1: {
      color: "#2f3f35",
      fontSize: "0.9375rem",
    },
    body2: {
      color: "#647469",
      fontSize: "0.84375rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid #e8ebe5",
          boxShadow: "0 4px 20px -6px rgba(25, 43, 33, 0.06)",
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
          "&:hover": {
            boxShadow: "0 6px 24px -6px rgba(25, 43, 33, 0.10)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        contained: {
          backgroundColor: "#174c3a",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#103d31",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "#edf0eb",
          padding: "14px 18px",
        },
        head: {
          backgroundColor: "#f9faf8",
          color: "#728277",
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
          fontSize: "0.75rem",
        },
      },
    },
  },
});
