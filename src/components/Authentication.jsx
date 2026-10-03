import React from 'react';
import { Box } from '@mui/material';
import { Login } from './Login';
import { Register } from './Register';

export const Authentication = () => {
  const [loginOrRegister, setLoginOrRegister] = React.useState('login');

  return (
    <Box
      width="100%"
      mt="20vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box m={2} width="400px" maxWidth="100%">
        {loginOrRegister === 'login' ? (
          <Login setLoginOrRegister={setLoginOrRegister} />
        ) : (
          <Register setLoginOrRegister={setLoginOrRegister} />
        )}
      </Box>
    </Box>
  );
};
