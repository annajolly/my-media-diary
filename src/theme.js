import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0c1f1a', contrastText: '#ffffff' },
    background: { default: '#f9f9fd', paper: '#ffffff' },
    text: { primary: '#191c1e', secondary: '#41484d' },
    divider: '#d9dade',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: { fontWeight: 600 },
    button: { textTransform: 'none' },
  },
  components: {
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          '&.Mui-active .MuiTableSortLabel-label': {
            color: '#41484d', // text.secondary for light
          },
        },
      },
    },
  },
  shape: { borderRadius: 4 },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#0c1f1a', contrastText: '#c2c8c4' },
    background: { default: '#101415', paper: '#191c1e' },
    text: { primary: '#c2c8c4', secondary: '#b6cbc3' },
    divider: '#363a3b',
  },
  typography: {
    fontFamily: 'Chivo, sans-serif',
    h1: { fontWeight: 600 },
    button: { textTransform: 'none' },
  },
  components: {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: '#191c1e',
          borderRadius: '4px',
          border: '1px solid #363a3b',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: '#c2c7cc',
          fontWeight: 700,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
          borderBottom: '2px solid #363a3b',
          padding: '16px 24px',
        },
        root: {
          borderBottom: '1px solid #363a3b',
          padding: '20px 24px',
          fontSize: '0.875rem',
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          '&.Mui-active': {
            color: '#b6cbc3',
          },
        },
      },
    },
  },
  shape: { borderRadius: 4 },
});

export const appTheme = {
  light: lightTheme,
  dark: darkTheme,
};
