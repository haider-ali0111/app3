import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Rating,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  IconButton,
  Fade,
  Skeleton,
  CircularProgress,
  Grid
} from '@mui/material';
import {
  LocationOn,
  Person,
  Send,
  Favorite,
  Comment,
  PlayCircle,
  Image as ImageIcon,
  AccessTime
} from '@mui/icons-material';
import { fetchMediaById, addComment, addRating } from '../../store/slices/mediaSlice';

const MediaDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentMedia: media, loading } = useSelector(state => state.media);
  const { user } = useSelector(state => state.auth);
  const [comment, setComment] = useState('');
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    dispatch(fetchMediaById(id));
  }, [dispatch, id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      dispatch(addComment({ mediaId: id, text: comment }));
      setComment('');
    }
  };

  const handleRatingChange = (event, newValue) => {
    setUserRating(newValue);
    dispatch(addRating({ mediaId: id, value: newValue }));
  };

  if (loading || !media) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container maxWidth="lg">
      <Fade in={true} timeout={500}>
        <Box sx={{ py: 4 }}>
          <Grid container spacing={4}>
            {/* Left Column - Media Content */}
            <Grid item xs={12} md={8}>
              <Paper 
                elevation={0}
                sx={{ 
                  borderRadius: 4,
                  overflow: 'hidden',
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box 
                  sx={{ 
                    position: 'relative',
                    backgroundColor: 'black',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 500,
                  }}
                >
                  {media.type === 'video' ? (
                    <video
                      src={media.url}
                      controls
                      style={{ width: '100%', maxHeight: '600px' }}
                    />
                  ) : (
                    <img
                      src={media.url}
                      alt={media.title}
                      style={{ width: '100%', maxHeight: '600px', objectFit: 'contain' }}
                    />
                  )}
                </Box>

                <Box sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                    <Box>
                      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                        {media.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {media.creator?.name?.[0]?.toUpperCase()}
                          </Avatar>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {media.creator?.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime color="action" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(media.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Chip
                      icon={media.type === 'video' ? <PlayCircle /> : <ImageIcon />}
                      label={media.type === 'video' ? 'Video' : 'Image'}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>

                  <Typography 
                    variant="body1" 
                    paragraph
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 3,
                    }}
                  >
                    {media.caption}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn color="primary" />
                      <Typography variant="body2">
                        {media.location || 'No location'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {media.tags?.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderRadius: 1,
                            '&:hover': {
                              backgroundColor: 'primary.light',
                              color: 'white',
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Box sx={{ mb: 4 }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: 'primary.main',
                        fontWeight: 600,
                      }}
                    >
                      <Favorite />
                      Rate this {media.type}
                    </Typography>
                    <Rating
                      value={userRating}
                      onChange={handleRatingChange}
                      precision={1}
                      size="large"
                      icon={<Favorite fontSize="inherit" />}
                      emptyIcon={<Favorite fontSize="inherit" />}
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: 'primary.main',
                        },
                        '& .MuiRating-iconHover': {
                          color: 'primary.light',
                        },
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Average rating: {media.averageRating?.toFixed(1) || 0} ({media.ratings?.length || 0} ratings)
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Right Column - Comments */}
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  borderRadius: 4,
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'primary.main',
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  <Comment />
                  Comments ({media.comments?.length || 0})
                </Typography>

                <form onSubmit={handleCommentSubmit}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      variant="outlined"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={!comment.trim()}
                      sx={{
                        minWidth: 'auto',
                        px: 2,
                        height: 'auto',
                      }}
                    >
                      <Send />
                    </Button>
                  </Box>
                </form>

                <List sx={{ maxHeight: 600, overflow: 'auto' }}>
                  {media.comments?.map((comment, index) => (
                    <React.Fragment key={comment._id}>
                      <ListItem 
                        alignItems="flex-start"
                        sx={{
                          px: 0,
                          '&:hover': {
                            backgroundColor: 'action.hover',
                            borderRadius: 2,
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar 
                            sx={{ 
                              bgcolor: 'primary.main',
                            }}
                          >
                            {comment.user?.name?.[0]?.toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography
                                component="span"
                                variant="subtitle2"
                                color="primary"
                                sx={{ fontWeight: 600 }}
                              >
                                {comment.user?.name}
                              </Typography>
                              <Typography
                                component="span"
                                variant="caption"
                                color="text.secondary"
                              >
                                {formatDate(comment.createdAt)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                              sx={{ display: 'block', mt: 1 }}
                            >
                              {comment.text}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < media.comments.length - 1 && (
                        <Divider variant="inset" component="li" sx={{ my: 2 }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Container>
  );
};

export default MediaDetail; 