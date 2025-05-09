import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';

// Components
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/routing/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import MediaGallery from './components/media/MediaGallery';
import MediaUpload from './components/media/MediaUpload';
import MediaDetail from './components/media/MediaDetail';
import Profile from './components/profile/Profile';

function App() {
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={<MediaGallery />} />
          <Route path="/media/:id" element={<MediaDetail />} />
          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <MediaUpload />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
