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
  Grid,
  Divider
} from '@mui/material';
import { CloudUpload, Add, Close, Image, Videocam, PlayCircle } from '@mui/icons-material';
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
          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            }}
          >
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 4,
              }}
            >
              <PlayCircle sx={{ fontSize: 32, color: 'primary.main' }} />
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{
                  color: 'text.primary',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                }}
              >
                Upload Media
              </Typography>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                }}
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
                      borderRadius: 3,
                      p: 3,
                      textAlign: 'center',
                      backgroundColor: 'action.hover',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'action.selected',
                        borderColor: 'primary.dark',
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
                            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                          />
                        ) : (
                          <img
                            src={preview}
                            alt="Preview"
                            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                          />
                        )}
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(4px)',
                            '&:hover': {
                              backgroundColor: 'error.main',
                              color: 'white',
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
                        <Typography variant="h6" color="primary" gutterBottom>
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
                      sx={{
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'divider',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderWidth: '2px',
                        },
                      }}
                      startAdornment={
                        formik.values.type === 'video' ? (
                          <Videocam sx={{ ml: 1, mr: 1, color: 'primary.main' }} />
                        ) : formik.values.type === 'image' ? (
                          <Image sx={{ ml: 1, mr: 1, color: 'primary.main' }} />
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
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                        '&.Mui-focused fieldset': {
                          borderWidth: '2px',
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
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                        '&.Mui-focused fieldset': {
                          borderWidth: '2px',
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
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                        '&.Mui-focused fieldset': {
                          borderWidth: '2px',
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
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                            '&.Mui-focused fieldset': {
                              borderWidth: '2px',
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
                          height: 56,
                          borderRadius: 2,
                          boxShadow: 'none',
                          '&:hover': {
                            boxShadow: 'none',
                          },
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
                            borderRadius: 1,
                            '&:hover': {
                              backgroundColor: 'primary.light',
                              color: 'white',
                              '& .MuiChip-deleteIcon': {
                                color: 'white',
                              },
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading || !file}
                    sx={{
                      height: 48,
                      fontSize: '1.1rem',
                      borderRadius: 2,
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress
                        size={24}
                        sx={{
                          color: 'inherit',
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