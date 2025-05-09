import React, { useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Fade,
  CircularProgress,
  Grid,
  Divider,
  Link
} from '@mui/material';
import { Login as LoginIcon, Email, Lock } from '@mui/icons-material';
import { login, clearError } from '../../store/slices/authSlice';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(login(values));
    }
  });

  return (
    <Container maxWidth="lg" sx={{ height: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center' }}>
      <Fade in={true} timeout={500}>
        <Grid container spacing={0} sx={{ height: '600px', boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.12)', borderRadius: 4, overflow: 'hidden' }}>
          {/* Left Side - Form */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                p: { xs: 4, md: 8 },
                backgroundColor: 'background.paper',
              }}
            >
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Welcome Back!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Sign in to continue your journey
                </Typography>
              </Box>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 3, borderRadius: 2 }}
                >
                  {typeof error === 'string' ? error : error.message || 'Login failed'}
                </Alert>
              )}

              <form onSubmit={formik.handleSubmit}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: <Email color="action" sx={{ mr: 1 }} />,
                  }}
                />
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  sx={{ mb: 4 }}
                  InputProps={{
                    startAdornment: <Lock color="action" sx={{ mr: 1 }} />,
                  }}
                />
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    position: 'relative',
                    '&:disabled': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: 'white',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                      }}
                    />
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/register"
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Image/Illustration */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, primary.main, primary.dark)',
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 8,
                backgroundColor: 'primary.main',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(124, 77, 255, 0.9), rgba(94, 53, 177, 0.9))',
                  zIndex: 1,
                },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                <LoginIcon sx={{ fontSize: 80, mb: 4 }} />
                <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                  StreamVibe
                </Typography>
                <Typography variant="h6" sx={{ maxWidth: 400, mx: 'auto', opacity: 0.9 }}>
                  Your ultimate destination for sharing and discovering amazing videos
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Fade>
    </Container>
  );
};

export default Login; 