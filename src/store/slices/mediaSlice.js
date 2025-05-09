import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../../config/config';

const API_URL = config.API_URL;

// Async thunks
export const uploadMedia = createAsyncThunk(
  'media/upload',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.post(`${API_URL}/media/upload`, formData, config);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Error uploading media';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchMedia = createAsyncThunk(
  'media/fetchAll',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get(
        `${API_URL}/media?page=${page}&limit=${limit}`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMediaById = createAsyncThunk(
  'media/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get(`${API_URL}/media/${id}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const searchMedia = createAsyncThunk(
  'media/search',
  async (searchParams, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get(
        `${API_URL}/media/search?${new URLSearchParams(searchParams)}`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addComment = createAsyncThunk(
  'media/addComment',
  async ({ mediaId, text }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.post(
        `${API_URL}/comments/${mediaId}`,
        { text },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addRating = createAsyncThunk(
  'media/addRating',
  async ({ mediaId, value }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.post(
        `${API_URL}/ratings/${mediaId}`,
        { value },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserMedia = createAsyncThunk(
  'media/fetchUserMedia',
  async () => {
    const response = await axios.get('/api/media/user');
    return response.data;
  }
);

export const deleteMedia = createAsyncThunk(
  'media/deleteMedia',
  async (mediaId) => {
    await axios.delete(`/api/media/${mediaId}`);
    return mediaId;
  }
);

const initialState = {
  media: [],
  currentMedia: null,
  userMedia: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  totalMedia: 0
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentMedia: (state) => {
      state.currentMedia = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Upload Media
      .addCase(uploadMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.media.unshift(action.payload);
        state.userMedia.unshift(action.payload);
        state.error = null;
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error uploading media';
      })
      // Fetch All Media
      .addCase(fetchMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.media = action.payload.media;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalMedia = action.payload.totalMedia;
      })
      .addCase(fetchMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Media by ID
      .addCase(fetchMediaById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMediaById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMedia = action.payload;
      })
      .addCase(fetchMediaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search Media
      .addCase(searchMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.media = action.payload;
      })
      .addCase(searchMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        if (state.currentMedia) {
          state.currentMedia.comments.push(action.payload);
        }
      })
      // Add Rating
      .addCase(addRating.fulfilled, (state, action) => {
        if (state.currentMedia) {
          state.currentMedia.averageRating = action.payload.averageRating;
          state.currentMedia.totalRatings = action.payload.totalRatings;
        }
      })
      // Fetch User Media
      .addCase(fetchUserMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.userMedia = action.payload;
      })
      .addCase(fetchUserMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete Media
      .addCase(deleteMedia.fulfilled, (state, action) => {
        state.userMedia = state.userMedia.filter(media => media._id !== action.payload);
        state.media = state.media.filter(media => media._id !== action.payload);
        if (state.currentMedia?._id === action.payload) {
          state.currentMedia = null;
        }
      });
  }
});

export const { clearError, clearCurrentMedia } = mediaSlice.actions;
export default mediaSlice.reducer; 