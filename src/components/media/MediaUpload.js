import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Fade,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import { CloudUpload, Add, Close, Image, Videocam } from '@mui/icons-material';
import { uploadMedia } from '../../store/slices/mediaSlice';

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters'),
  caption: Yup.string(),
  location: Yup.string(),
  type: Yup.string()
    .required('Media type is required')
    .oneOf(['video', 'image'], 'Media type must be either video or image'),
  tags: Yup.array().of(Yup.string())
});

const MediaUpload = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.media);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [tagInput, setTagInput] = useState('');

  const formik = useFormik({
    initialValues: {
      title: '',
      caption: '',
      location: '',
      type: '',
      tags: []
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!file) {
        formik.setFieldError('file', 'Please select a file');
        return;
      }

      const formData = new FormData();
      formData.append('media', file);
      formData.append('title', values.title);
      formData.append('caption', values.caption);
      formData.append('location', values.location);
      formData.append('type', values.type);
      formData.append('tags', JSON.stringify(values.tags));

      const result = await dispatch(uploadMedia(formData));
      if (!result.error) {
        navigate('/');
      }
    }
  });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formik.values.tags.includes(tagInput.trim())) {
      formik.setFieldValue('tags', [...formik.values.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    formik.setFieldValue(
      'tags',
      formik.values.tags.filter(tag => tag !== tagToRemove)
    );
  };

  return (
    <Container maxWidth="md">
      <Fade in={true} timeout={500}>
        <Box sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <CloudUpload />
              Upload Media
            </Typography>

            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3, borderRadius: 2 }}
              >
                {typeof error === 'string' 
                  ? error 
                  : error.message || 'Error uploading media. Please try again.'}
              </Alert>
            )}

            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      border: '2px dashed',
                      borderColor: 'primary.main',
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      backgroundColor: 'action.hover',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.selected',
                      },
                    }}
                    onClick={() => document.getElementById('file-input').click()}
                  >
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    {preview ? (
                      <Box sx={{ position: 'relative' }}>
                        {formik.values.type === 'video' ? (
                          <video
                            src={preview}
                            controls
                            style={{ maxWidth: '100%', maxHeight: '300px' }}
                          />
                        ) : (
                          <img
                            src={preview}
                            alt="Preview"
                            style={{ maxWidth: '100%', maxHeight: '300px' }}
                          />
                        )}
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                            setPreview(null);
                          }}
                        >
                          <Close />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box>
                        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" color="primary">
                          Click to select a file
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Supported formats: Images and Videos
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Media Type</InputLabel>
                    <Select
                      name="type"
                      value={formik.values.type}
                      onChange={formik.handleChange}
                      error={formik.touched.type && Boolean(formik.errors.type)}
                      label="Media Type"
                      startAdornment={
                        formik.values.type === 'video' ? (
                          <Videocam sx={{ mr: 1, color: 'primary.main' }} />
                        ) : formik.values.type === 'image' ? (
                          <Image sx={{ mr: 1, color: 'primary.main' }} />
                        ) : null
                      }
                    >
                      <MenuItem value="image">Image</MenuItem>
                      <MenuItem value="video">Video</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="title"
                    label="Title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="caption"
                    label="Caption"
                    multiline
                    rows={3}
                    value={formik.values.caption}
                    onChange={formik.handleChange}
                    error={formik.touched.caption && Boolean(formik.errors.caption)}
                    helperText={formik.touched.caption && formik.errors.caption}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="location"
                    label="Location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    error={formik.touched.location && Boolean(formik.errors.location)}
                    helperText={formik.touched.location && formik.errors.location}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Tags
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <TextField
                        fullWidth
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                        sx={{
                          minWidth: 48,
                          height: 48,
                        }}
                      >
                        <Add />
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formik.values.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          onDelete={() => handleRemoveTag(tag)}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'primary.light',
                              color: 'white',
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading || !file}
                    sx={{
                      height: 48,
                      fontSize: '1.1rem',
                      position: 'relative',
                    }}
                  >
                    {loading ? (
                      <CircularProgress
                        size={24}
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          marginTop: '-12px',
                          marginLeft: '-12px',
                        }}
                      />
                    ) : (
                      'Upload'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default MediaUpload; 