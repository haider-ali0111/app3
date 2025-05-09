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
  InputAdornment
} from '@mui/material';
import {
  CloudUpload,
  Add,
  Close,
  Image,
  Videocam,
  LocationOn,
  Label,
  Title,
  Description
} from '@mui/icons-material';
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
  const [dragActive, setDragActive] = useState(false);

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
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      formik.setFieldValue('type', selectedFile.type.startsWith('video/') ? 'video' : 'image');
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
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
        <Box sx={{ py: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 4,
              }}
            >
              <CloudUpload />
              Upload Media
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{ mb: 4, borderRadius: 2 }}
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
                      borderColor: dragActive ? 'primary.main' : 'divider',
                      borderRadius: 4,
                      p: 3,
                      textAlign: 'center',
                      backgroundColor: dragActive ? 'action.hover' : 'background.default',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'action.hover',
                      },
                    }}
                    onClick={() => document.getElementById('file-input').click()}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
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
                            style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                          />
                        )}
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': {
                              backgroundColor: 'white',
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                            setPreview(null);
                            formik.setFieldValue('type', '');
                          }}
                        >
                          <Close />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box>
                        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" color="primary" gutterBottom>
                          Drag and drop your file here
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          or click to select a file
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          Supported formats: Images and Videos
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth error={formik.touched.type && Boolean(formik.errors.type)}>
                    <InputLabel>Media Type</InputLabel>
                    <Select
                      name="type"
                      value={formik.values.type}
                      onChange={formik.handleChange}
                      label="Media Type"
                      startAdornment={
                        formik.values.type === 'video' ? (
                          <Videocam sx={{ ml: 1, mr: -0.5, color: 'primary.main' }} />
                        ) : formik.values.type === 'image' ? (
                          <Image sx={{ ml: 1, mr: -0.5, color: 'primary.main' }} />
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Title color="primary" />
                        </InputAdornment>
                      ),
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Description color="primary" />
                        </InputAdornment>
                      ),
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Label color="primary" />
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
                      />
                      <Button
                        variant="contained"
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                        sx={{
                          minWidth: 48,
                          height: 56,
                          borderRadius: 2,
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
                            borderRadius: 2,
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
                      height: 56,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                      },
                      transition: 'transform 0.2s ease-in-out',
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
                      'Upload Media'
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