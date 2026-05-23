import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      light: '#2f4c4d',
      main: '#051F20',
      dark: '#031516',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#7bc7c3',
      main: '#0B5351',
      dark: '#073f3d',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f6f9f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#122223',
      secondary: '#3e5253',
    },
    divider: '#b6c6c7',
  },
});
