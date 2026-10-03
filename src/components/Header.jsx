import {
  AppBar,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Toolbar,
  Typography,
} from '@mui/material';
import { useUserContext } from '../context/user-context';
import { signout } from '../api/firebase';
import { MyMediaDiaryLogo } from './MyMediaDiaryLogo';
import { CaretDownIcon, MoonIcon, SunIcon } from '@phosphor-icons/react';
import { useOpenable } from '../hooks/use-openable';

export const Header = ({ themeMode = 'light', onToggleThemeMode }) => {
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
          direction="row"
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack direction="row" sx={{ alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgb(250, 240, 230)' }}>
              <MyMediaDiaryLogo />
            </Avatar>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Chivo, sans-serif',
                fontWeight: 700,
                fontSize: '1.25rem',
                color: 'rgb(250, 240, 230)',
                letterSpacing: '-0.01em',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              MyMediaDiary
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <Tooltip
              title={
                themeMode === 'dark'
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              }
            >
              <IconButton
                onClick={onToggleThemeMode}
                aria-label="Toggle theme mode"
                sx={{ color: 'rgb(250, 240, 230)' }}
              >
                {themeMode === 'dark' ? (
                  <SunIcon size={20} />
                ) : (
                  <MoonIcon size={20} />
                )}
              </IconButton>
            </Tooltip>
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
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
