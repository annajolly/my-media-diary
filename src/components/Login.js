import React from 'react';
import JustValidate from 'just-validate';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useUserContext } from '../context/user-context';
import { signInWithEmailAndPassword } from '../api/firebase';

export const Login = (props) => {
  const { setLoginOrRegister } = props;
  const { setUser } = useUserContext();
  const formRef = React.useRef(null);

  React.useEffect(() => {
    if (formRef.current) {
      const validator = new JustValidate('#login-form');

      validator
        .addField('#login-form-email', [
          {
            rule: 'required',
          },
          {
            rule: 'email',
          },
        ])
        .addField('#login-form-password', [
          {
            rule: 'required',
          },
          {
            rule: 'password',
          },
        ])
        .onSuccess((event) => {
          event.preventDefault();

          const formData = new FormData(formRef.current);
          const email = formData.get('login-form-email');
          const password = formData.get('login-form-password');

          signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
              var user = userCredential.user;
              console.log(user);
              setUser(user);
            })
            .catch((error) => {
              console.error(error);
            });
        });
    }
  }, [setUser]);

  const handleRegisterClicked = () => {
    setLoginOrRegister('register');
  };

  return (
    <Stack gap={2}>
      Login
      <Stack
        ref={formRef}
        id="login-form"
        component="form"
        noValidate
        autoComplete="off"
        gap={2}
      >
        <TextField
          id="login-form-email"
          name="login-form-email"
          label="Email"
          variant="outlined"
        />
        <TextField
          id="login-form-password"
          name="login-form-password"
          label="Password"
          variant="outlined"
          type="password"
        />
        <Button type="submit" variant="contained">
          Login
        </Button>
      </Stack>
      <Box>
        No account? <Button onClick={handleRegisterClicked}>Register</Button>{' '}
        instead.
      </Box>
    </Stack>
  );
};
