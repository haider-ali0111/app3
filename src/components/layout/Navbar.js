import React from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
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
  Slide,
  Container,
  Tooltip,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Upload as UploadIcon,
  PlayCircle,
  Home,
  Explore,
  Notifications,
  Settings,
  Logout,
  Person
} from '@mui/icons-material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    ...(user?.role === 'creator' ? [{ text: 'Upload', icon: <UploadIcon />, path: '/upload' }] : []),
  ];

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, mb: 3 }}>
        <PlayCircle sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>
          DailyStreak
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              handleDrawerToggle();
            }}
            sx={{
              mx: 1,
              mb: 1,
              borderRadius: 2,
              backgroundColor: isActive(item.path) ? 'primary.main' : 'transparent',
              color: isActive(item.path) ? 'white' : 'text.primary',
              '&:hover': {
                backgroundColor: isActive(item.path) ? 'primary.dark' : 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? 'white' : 'primary.main' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: isActive(item.path) ? 600 : 400,
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

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
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', height: 70, px: { xs: 1, sm: 2 } }}>
            {isMobile && (
              <IconButton
                color="primary"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <RouterLink 
                to="/"
                style={{ 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <PlayCircle sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
                {!isMobile && (
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    DailyStreak
                  </Typography>
                )}
              </RouterLink>
            </Box>

            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    startIcon={item.icon}
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      backgroundColor: isActive(item.path) ? 'primary.main' : 'transparent',
                      color: isActive(item.path) ? 'white' : 'text.primary',
                      '&:hover': {
                        backgroundColor: isActive(item.path) ? 'primary.dark' : 'action.hover',
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}

            {isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Tooltip title="Notifications">
                  <IconButton
                    sx={{
                      borderRadius: 2,
                      p: 1,
                      '&:hover': { backgroundColor: 'action.hover' },
                    }}
                  >
                    <Badge badgeContent={3} color="primary">
                      <Notifications />
                    </Badge>
                  </IconButton>
                </Tooltip>

                <IconButton
                  onClick={handleMenu}
                  sx={{
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: 'primary.main',
                    p: 0.5,
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      '& .MuiAvatar-root': {
                        backgroundColor: 'primary.dark',
                      },
                    },
                  }}
                >
                  {user?.name ? (
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32,
                        backgroundColor: 'primary.main',
                        fontSize: '1rem',
                        transition: 'background-color 0.2s ease-in-out',
                      }}
                    >
                      {user.name[0].toUpperCase()}
                    </Avatar>
                  ) : (
                    <AccountCircle />
                  )}
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      mt: 1.5,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                      minWidth: 200,
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem 
                    onClick={handleProfile}
                    sx={{
                      borderRadius: 1,
                      mx: 0.5,
                      gap: 1.5,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <Person fontSize="small" />
                    Profile
                  </MenuItem>
                  <MenuItem 
                    sx={{
                      borderRadius: 1,
                      mx: 0.5,
                      gap: 1.5,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <Settings fontSize="small" />
                    Settings
                  </MenuItem>
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{
                      borderRadius: 1,
                      mx: 0.5,
                      gap: 1.5,
                      color: 'error.main',
                      '&:hover': {
                        backgroundColor: 'error.light',
                        color: 'white',
                      },
                    }}
                  >
                    <Logout fontSize="small" />
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
                    borderRadius: 2,
                    px: 3,
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
                    borderRadius: 2,
                    px: 3,
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
        </Container>

        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box',
              width: 250,
              borderRight: 'none',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          {drawer}
        </Drawer>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar; 