import React from 'react';
import { MyMediaDiaryApp } from './components/MyMediaDiaryApp';
import { UserContextProvider } from './context/user-context';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { appTheme } from './theme';

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [themeMode, setThemeMode] = React.useState(
    prefersDarkMode ? 'dark' : 'light',
  );

  React.useEffect(() => {
    setThemeMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  const handleToggleThemeMode = () => {
    setThemeMode((previousMode) =>
      previousMode === 'light' ? 'dark' : 'light',
    );
  };

  const theme = themeMode === 'dark' ? appTheme.dark : appTheme.light;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserContextProvider>
        <MyMediaDiaryApp
          themeMode={themeMode}
          onToggleThemeMode={handleToggleThemeMode}
        />
      </UserContextProvider>
    </ThemeProvider>
  );
};

export default App;
