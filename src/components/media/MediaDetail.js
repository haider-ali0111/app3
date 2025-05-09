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
  Grid,
  useTheme,
  alpha,
  Card,
  CardContent
} from '@mui/material';
import {
  LocationOn,
  Person,
  Send,
  Favorite,
  Comment,
  PlayCircle,
  Image as ImageIcon,
  AccessTime,
  Share,
  BookmarkBorder,
  Bookmark
} from '@mui/icons-material';
import { fetchMediaById, addComment, addRating } from '../../store/slices/mediaSlice';

const MediaDetail = () => {
  const theme = useTheme();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentMedia: media, loading } = useSelector(state => state.media);
  const { user } = useSelector(state => state.auth);
  const [comment, setComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading || !media) {
    return (
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={48} sx={{ color: theme.palette.primary.main }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Fade in={true} timeout={500}>
        <Grid container spacing={4}>
          {/* Left Column - Media Content */}
          <Grid item xs={12} lg={8}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 4,
                overflow: 'hidden',
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
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
                  maxHeight: 'calc(100vh - 200px)',
                }}
              >
                {media.type === 'video' ? (
                  <video
                    src={media.url}
                    controls
                    style={{ width: '100%', height: '100%', maxHeight: 'calc(100vh - 200px)', objectFit: 'contain' }}
                  />
                ) : (
                  <img
                    src={media.url}
                    alt={media.title}
                    style={{ width: '100%', height: '100%', maxHeight: 'calc(100vh - 200px)', objectFit: 'contain' }}
                  />
                )}
              </Box>

              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box>
                    <Typography 
                      variant="h4" 
                      component="h1" 
                      gutterBottom
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        mb: 2
                      }}
                    >
                      {media.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: theme.palette.primary.main,
                          }}
                        >
                          {media.creator?.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {media.creator?.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(media.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn sx={{ color: theme.palette.primary.main }} />
                        <Typography variant="body2" color="text.secondary">
                          {media.location || 'No location'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      sx={{ 
                        color: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.2),
                        }
                      }}
                    >
                      <Share />
                    </IconButton>
                    <IconButton 
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      sx={{ 
                        color: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.2),
                        }
                      }}
                    >
                      {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                    </IconButton>
                  </Box>
                </Box>

                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ 
                    mb: 3,
                    lineHeight: 1.7
                  }}
                >
                  {media.caption}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                  {media.tags?.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                        color: theme.palette.text.secondary,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          borderColor: theme.palette.primary.main,
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  ))}
                </Box>

                <Divider sx={{ mb: 4 }} />

                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Rate this {media.type}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Rating
                      value={userRating}
                      onChange={handleRatingChange}
                      precision={0.5}
                      size="large"
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: theme.palette.primary.main,
                        },
                        '& .MuiRating-iconHover': {
                          color: theme.palette.primary.light,
                        },
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      ({media.ratings?.length || 0} ratings)
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Comments
                  </Typography>
                  <Box 
                    component="form" 
                    onSubmit={handleCommentSubmit}
                    sx={{ 
                      display: 'flex',
                      gap: 2,
                      mb: 3
                    }}
                  >
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: alpha(theme.palette.background.paper, 0.6),
                          backdropFilter: 'blur(10px)',
                          borderRadius: 2,
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                          },
                          '&.Mui-focused': {
                            backgroundColor: theme.palette.background.paper,
                          },
                        },
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={!comment.trim()}
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        height: 'fit-content',
                        alignSelf: 'flex-end',
                      }}
                    >
                      Post
                    </Button>
                  </Box>

                  <List sx={{ width: '100%' }}>
                    {media.comments?.map((comment, index) => (
                      <React.Fragment key={comment._id}>
                        <ListItem 
                          alignItems="flex-start"
                          sx={{ 
                            px: 0,
                            py: 2
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                backgroundColor: theme.palette.primary.main,
                              }}
                            >
                              {comment.user?.name?.[0]?.toUpperCase()}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  {comment.user?.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatDate(comment.createdAt)}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Typography
                                variant="body2"
                                color="text.primary"
                                sx={{ 
                                  mt: 1,
                                  lineHeight: 1.6
                                }}
                              >
                                {comment.text}
                              </Typography>
                            }
                          />
                        </ListItem>
                        {index < media.comments.length - 1 && (
                          <Divider variant="inset" component="li" />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Related Content */}
          <Grid item xs={12} lg={4}>
            <Card
              elevation={0}
              sx={{ 
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                position: 'sticky',
                top: 24,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Related Content
                </Typography>
                {/* Add related content here */}
                <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                  <Typography variant="body2">
                    Related content coming soon...
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Fade>
    </Container>
  );
};

export default MediaDetail; 