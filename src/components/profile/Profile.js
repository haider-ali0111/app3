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
  Tabs
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Videocam as VideocamIcon
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
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                  mr: 3
                }}
              >
                {user.name?.[0]?.toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {user.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Role: {user.role}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{ ml: 'auto' }}
                onClick={() => navigate('/profile/edit')}
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
                        '&:hover': {
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
                          sx={{ objectFit: 'cover' }}
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
                            transition: 'opacity 0.3s ease-in-out',
                          }}
                        >
                          <IconButton
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              },
                            }}
                            onClick={() => navigate(`/media/${media._id}`)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              },
                            }}
                            onClick={() => handleDeleteMedia(media._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="h2" noWrap>
                          {media.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {media.caption}
                        </Typography>
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
                  py: 4,
                  color: 'text.secondary',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  No {tabValue === 0 ? 'images' : 'videos'} found
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/upload')}
                  sx={{ mt: 2 }}
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