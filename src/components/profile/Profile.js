import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Fade,
  CircularProgress,
  Divider,
  Tab,
  Tabs,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Videocam as VideocamIcon,
  LocationOn,
  Tag
} from '@mui/icons-material';
import { fetchUserMedia, deleteMedia } from '../../store/slices/mediaSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { userMedia, loading } = useSelector(state => state.media);
  const [tabValue, setTabValue] = React.useState(0);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserMedia());
    }
  }, [dispatch, user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDeleteMedia = async (mediaId) => {
    if (window.confirm('Are you sure you want to delete this media?')) {
      await dispatch(deleteMedia(mediaId));
    }
  };

  if (!user) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const filteredMedia = userMedia.filter(media => 
    tabValue === 0 ? media.type === 'image' : media.type === 'video'
  );

  return (
    <Container maxWidth="lg">
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
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: 'primary.main',
                  fontSize: '3rem',
                  mr: 4,
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                }}
              >
                {user.name?.[0]?.toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {user.name}
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {user.email}
                </Typography>
                <Chip
                  label={user.role}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ 
                    borderRadius: 1,
                    textTransform: 'capitalize',
                  }}
                />
              </Box>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate('/profile/edit')}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    backgroundColor: 'primary.light',
                    color: 'white',
                  },
                }}
              >
                Edit Profile
              </Button>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Box sx={{ mb: 4 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    minWidth: 120,
                    borderRadius: 2,
                    mx: 0.5,
                    '&.Mui-selected': {
                      color: 'primary.main',
                      fontWeight: 600,
                    },
                  },
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: 1.5,
                  },
                }}
              >
                <Tab
                  icon={<PhotoLibraryIcon />}
                  label="Images"
                  iconPosition="start"
                />
                <Tab
                  icon={<VideocamIcon />}
                  label="Videos"
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredMedia.map((media) => (
                  <Grid item key={media._id} xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
                          '& .media-actions': {
                            opacity: 1,
                          },
                        },
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component={media.type === 'video' ? 'video' : 'img'}
                          height="200"
                          image={media.url}
                          alt={media.title}
                          sx={{ 
                            objectFit: 'cover',
                            backgroundColor: 'action.hover',
                          }}
                        />
                        <Box
                          className="media-actions"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            display: 'flex',
                            gap: 1,
                            opacity: 0,
                            transition: 'opacity 0.2s ease-in-out',
                          }}
                        >
                          <IconButton
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              backdropFilter: 'blur(4px)',
                              '&:hover': {
                                backgroundColor: 'primary.main',
                                color: 'white',
                              },
                            }}
                            onClick={() => navigate(`/media/${media._id}`)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              backdropFilter: 'blur(4px)',
                              '&:hover': {
                                backgroundColor: 'error.main',
                                color: 'white',
                              },
                            }}
                            onClick={() => handleDeleteMedia(media._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Typography 
                          variant="h6" 
                          component="h2" 
                          gutterBottom 
                          sx={{
                            fontWeight: 600,
                            fontSize: '1.1rem',
                          }}
                        >
                          {media.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {media.caption}
                        </Typography>
                        {media.location && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {media.location}
                            </Typography>
                          </Box>
                        )}
                        {media.tags && media.tags.length > 0 && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {media.tags.map((tag, index) => (
                              <Chip
                                key={index}
                                icon={<Tag />}
                                label={tag}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderRadius: 1,
                                  '&:hover': {
                                    backgroundColor: 'primary.light',
                                    color: 'white',
                                    '& .MuiChip-icon': {
                                      color: 'white',
                                    },
                                  },
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {!loading && filteredMedia.length === 0 && (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  px: 2,
                  backgroundColor: 'action.hover',
                  borderRadius: 3,
                }}
              >
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                  }}
                >
                  No {tabValue === 0 ? 'images' : 'videos'} found
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/upload')}
                  startIcon={tabValue === 0 ? <PhotoLibraryIcon /> : <VideocamIcon />}
                  sx={{ 
                    mt: 2,
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                  }}
                >
                  Upload {tabValue === 0 ? 'Image' : 'Video'}
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default Profile; 