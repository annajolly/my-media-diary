import {
  AppBar,
  Avatar,
  Button,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useUserContext } from '../context/user-context';
import { signout } from '../api/firebase';
import { MyMediaDiaryLogo } from './MyMediaDiaryLogo';
import { CaretDownIcon } from '@phosphor-icons/react';
import { useOpenable } from '../hooks/use-openable';

export const Header = () => {
  const { user } = useUserContext();
  const userMenu = useOpenable();

  const handleSignout = () => {
    signout();
    userMenu.close();
  };

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          minHeight: '48px !important',
        }}
      >
        <Stack
          mx={1}
          width="100%"
          direction="row"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: 'rgb(250, 240, 230)' }}>
              <MyMediaDiaryLogo />
            </Avatar>
            <Typography variant="h6" sx={{ color: 'rgb(250, 240, 230)' }}>
              MyMediaDiary
            </Typography>
          </Stack>
          {user && (
            <>
              <Button
                id="user-menu-button"
                aria-controls={userMenu.isOpen ? 'user-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={userMenu.isOpen ? 'true' : undefined}
                onClick={userMenu.open}
                endIcon={<CaretDownIcon color="rgb(250, 240, 230)" />}
              >
                <Typography sx={{ color: 'rgb(250, 240, 230)' }}>
                  {user.email}
                </Typography>
              </Button>
              <Menu
                id="user-menu"
                anchorEl={userMenu.anchorEl}
                open={userMenu.isOpen}
                onClose={userMenu.close}
                slotProps={{
                  list: {
                    'aria-labelledby': 'user-menu-button',
                  },
                }}
              >
                <MenuItem onClick={handleSignout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
