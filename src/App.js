import { MyMediaDiaryApp } from './components/MyMediaDiaryApp';
import { UserContextProvider } from './context/user-context';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { appTheme } from './theme';

const App = () => (
  <ThemeProvider theme={appTheme}>
    <CssBaseline />
    <UserContextProvider>
      <MyMediaDiaryApp />
    </UserContextProvider>
  </ThemeProvider>
);

export default App;
