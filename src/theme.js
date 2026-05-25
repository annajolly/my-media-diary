import { createTheme } from '@mui/material/styles';

const commonComponentsTheme = {
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontSize: 20,
        fontWeight: 700,
        color: '#e2e2e6',
        letterSpacing: '-0.01em',
      },
    },
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0c1f1a', contrastText: '#ffffff' },
    background: { default: '#f9f9fd', paper: '#ffffff' },
    text: { primary: '#191c1e', secondary: '#41484d' },
    divider: '#d9dade',
  },
  typography: {
    fontFamily: 'Chivo, Inter, Arial, sans-serif',
    h1: { fontWeight: 600 },
    button: { textTransform: 'none' },
  },
  components: {
    ...commonComponentsTheme,
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
    primary: { main: '#b6cbc3', contrastText: '#21342e' },
    secondary: { main: '#04b4a2', light: '#00bcd4', contrastText: '#003731' },
    background: { default: '#101415', paper: '#1d2022' },
    text: { primary: '#c2c8c4', secondary: '#8e9196' },
    divider: '#363a3b',
  },
  typography: {
    fontFamily: 'Chivo, Inter, Arial, sans-serif',
    h1: { fontWeight: 600 },
    button: { textTransform: 'none' },
  },
  components: {
    ...commonComponentsTheme,
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#191c1e',
          backgroundImage: 'none',
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgb(16,20,21)',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          backgroundColor: '#1d2022',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1d2022',
        },
      },
    },
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
          padding: '16px 24px',
          backgroundColor: '#272a2c',
        },
        root: {
          borderBottom: '1px solid #363a3b',
          padding: '20px 24px',
          fontSize: '0.875rem',
          height: 56,
          paddingTop: 0,
          paddingBottom: 0,
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
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgb(16,20,21)',
        },
        input: {
          backgroundColor: 'inherit',
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgb(16,20,21)',
        },
        input: {
          backgroundColor: 'inherit',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgb(16,20,21)',
        },
        input: {
          backgroundColor: 'inherit',
        },
      },
    },
    MuiPickersOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgb(16,20,21)',
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
