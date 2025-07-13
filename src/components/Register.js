import React from 'react';
import JustValidate from 'just-validate';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useUserContext } from '../context/user-context';
import { createUserWithEmailAndPassword } from '../api/firebase';

export const Register = (props) => {
  const { setLoginOrRegister } = props;
  const { setUser } = useUserContext();
  const formRef = React.useRef(null);

  React.useEffect(() => {
    if (formRef.current) {
      const validator = new JustValidate('#register-form');

      validator
        .addField('#register-form-email', [
          {
            rule: 'required',
          },
          {
            rule: 'email',
          },
        ])
        .addField('#register-form-password', [
          {
            rule: 'required',
          },
          {
            rule: 'password',
          },
        ])
        .addField('#register-form-repeat-password', [
          {
            rule: 'required',
          },
          {
            validator: (value, fields) => {
              if (
                fields['#register-form-password'] &&
                fields['#register-form-password'].elem
              ) {
                const repeatPasswordValue =
                  fields['#register-form-password'].elem.value;

                return value === repeatPasswordValue;
              }

              return true;
            },
            errorMessage: 'Passwords should be the same',
          },
        ])
        .onSuccess((event) => {
          event.preventDefault();

          const formData = new FormData(formRef.current);
          const email = formData.get('register-form-email');
          const password = formData.get('register-form-password');

          createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
              var user = userCredential.user;
              setUser(user);
            })
            .catch((error) => {
              console.error(error);
            });
        });
    }
  }, [setUser]);

  const handleLoginClicked = () => {
    setLoginOrRegister('login');
  };

  return (
    <Stack gap={2}>
      Register
      <Stack
        ref={formRef}
        id="register-form"
        component="form"
        noValidate
        autoComplete="off"
        gap={2}
      >
        <TextField
          id="register-form-email"
          name="register-form-email"
          label="Email"
          variant="outlined"
        />
        <TextField
          id="register-form-password"
          name="register-form-password"
          label="Password"
          variant="outlined"
          type="password"
        />
        <TextField
          id="register-form-repeat-password"
          label="Password"
          variant="outlined"
          type="password"
        />
        <Button type="submit" variant="contained">
          Register
        </Button>
      </Stack>
      <Box>
        Already have an account?{' '}
        <Button onClick={handleLoginClicked}>Login</Button> instead.
      </Box>
    </Stack>
  );
};
