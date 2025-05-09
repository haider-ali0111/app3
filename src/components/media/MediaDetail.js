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
  CircularProgress
} from '@mui/material';
import { LocationOn, Person, Send, Favorite, Comment } from '@mui/icons-material';
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
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Fade in={true} timeout={500}>
        <Box sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box 
              sx={{ 
                mb: 4,
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: 'black',
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

            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{
                color: 'primary.main',
                fontWeight: 600,
              }}
            >
              {media.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person color="primary" />
                <Typography variant="body1">
                  {media.creator?.name}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn color="primary" />
                <Typography variant="body1">
                  {media.location}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Rating
                value={media.averageRating || 0}
                readOnly
                precision={0.5}
                size="large"
                icon={<Favorite fontSize="inherit" />}
                emptyIcon={<Favorite fontSize="inherit" />}
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1, display: 'inline' }}>
                ({media.ratings?.length || 0} ratings)
              </Typography>
            </Box>

            <Typography 
              variant="body1" 
              paragraph
              sx={{
                color: 'text.secondary',
                lineHeight: 1.7,
              }}
            >
              {media.caption}
            </Typography>

            <Box sx={{ mb: 4 }}>
              {media.tags?.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  sx={{ 
                    mr: 1, 
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'white',
                    },
                  }}
                />
              ))}
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'primary.main',
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
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'primary.main',
                }}
              >
                <Comment />
                Comments
              </Typography>
              <form onSubmit={handleCommentSubmit}>
                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
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
                    type="submit"
                    disabled={!comment.trim()}
                    sx={{
                      minWidth: 48,
                      height: 48,
                    }}
                  >
                    <Send />
                  </Button>
                </Box>
              </form>

              <List>
                {media.comments?.map((comment, index) => (
                  <React.Fragment key={comment._id}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          borderRadius: 1,
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
                          <Typography
                            component="span"
                            variant="subtitle2"
                            color="primary"
                            sx={{ fontWeight: 600 }}
                          >
                            {comment.user?.name}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                              sx={{ display: 'block', my: 0.5 }}
                            >
                              {comment.text}
                            </Typography>
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(comment.createdAt).toLocaleString()}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < media.comments.length - 1 && (
                      <Divider variant="inset" component="li" sx={{ my: 1 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default MediaDetail; 