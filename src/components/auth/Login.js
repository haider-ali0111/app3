import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CircularProgress
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
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
    <Container maxWidth="sm">
      <Fade in={true} timeout={500}>
        <Box 
          sx={{ 
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              align="center"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
              }}
            >
              Welcome Back
            </Typography>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  width: '100%',
                  borderRadius: 2,
                }}
              >
                {typeof error === 'string' ? error : error.message || 'Login failed'}
              </Alert>
            )}

            <form 
              onSubmit={formik.handleSubmit}
              style={{ width: '100%' }}
            >
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
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
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                sx={{
                  mt: 3,
                  mb: 2,
                  height: 48,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default Login; 