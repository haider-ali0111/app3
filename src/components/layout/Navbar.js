import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  useScrollTrigger,
  Slide
} from '@mui/material';
import { AccountCircle, Upload, VideoLibrary } from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';

// Hide navbar on scroll down
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  return (
    <HideOnScroll>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: 600,
            }}
          >
            <VideoLibrary />
            Video App
          </Typography>

          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {user?.role === 'creator' && (
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/upload"
                  startIcon={<Upload />}
                  sx={{
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  Upload
                </Button>
              )}
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                sx={{
                  border: '2px solid',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                  },
                }}
              >
                {user?.name ? (
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32,
                      backgroundColor: 'primary.main',
                    }}
                  >
                    {user.name[0].toUpperCase()}
                  </Avatar>
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    borderRadius: 2,
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <MenuItem 
                  onClick={handleProfile}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'white',
                    },
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem 
                  onClick={handleLogout}
                  sx={{
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: 'error.light',
                      color: 'white',
                    },
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                component={RouterLink}
                to="/login"
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    backgroundColor: 'primary.light',
                    color: 'white',
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                component={RouterLink}
                to="/register"
                sx={{
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar; 