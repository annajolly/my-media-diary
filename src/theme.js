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
  shape: { borderRadius: 4 },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#0c1f1a', contrastText: '#e2e2e6' },
    background: { default: '#101415', paper: '#191c1e' },
    text: { primary: '#e2e2e6', secondary: '#c2c7cc' },
    divider: '#41484d',
  },
  typography: {
    fontFamily: 'Chivo, sans-serif',
    h1: { fontWeight: 600 },
    button: { textTransform: 'none' },
  },
  shape: { borderRadius: 4 },
});

export const appTheme = {
  light: lightTheme,
  dark: darkTheme,
};
