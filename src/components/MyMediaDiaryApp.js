import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';
import { onAuthStateChanged } from '../api/firebase';
import { Authentication } from './Authentication';
import { Header } from './Header';
import { MediaDiary } from './MediaDiary';
import { useUserContext } from '../context/user-context';

export const MyMediaDiaryApp = () => {
  const { user, setUser } = useUserContext();
  const [isLoadingAuth, setIsLoadingAuth] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setUser(user);
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <div className="App">
      <Header />
      {isLoadingAuth && (
        <Box
          display="flex"
          height="100vh"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
        </Box>
      )}
      {!isLoadingAuth && !user && <Authentication />}
      {!isLoadingAuth && user && <MediaDiary />}
    </div>
  );
};
