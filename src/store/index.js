import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import mediaReducer from './slices/mediaSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    media: mediaReducer,
  },
});

export default store; 