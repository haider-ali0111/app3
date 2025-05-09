import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Pagination,
  Rating,
  Chip,
  Fade,
  Skeleton,
  CircularProgress,
  CardActionArea,
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import {
  Search,
  LocationOn,
  Person,
  VideoLibrary,
  PlayCircle,
  Image as ImageIcon,
  AccessTime
} from '@mui/icons-material';
import { fetchMedia, searchMedia } from '../../store/slices/mediaSlice';

const MediaGallery = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { media, loading, totalPages, currentPage } = useSelector(state => state.media);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    dispatch(fetchMedia({ page: currentPage }));
  }, [dispatch, currentPage]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchTimeout(
      setTimeout(() => {
        if (value.trim()) {
          dispatch(searchMedia({ query: value }));
        } else {
          dispatch(fetchMedia({ page: 1 }));
        }
      }, 500)
    );
  };

  const handlePageChange = (event, value) => {
    dispatch(fetchMedia({ page: value }));
  };

  const handleMediaClick = (id) => {
    navigate(`/media/${id}`);
  };

  const renderSkeleton = () => (
    <Grid item xs={12} sm={6} md={4}>
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 3,
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: theme.shadows[8],
          }
        }}
      >
        <Skeleton variant="rectangular" height={240} sx={{ borderRadius: '16px 16px 0 0' }} />
        <CardContent>
          <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={24} sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
          </Box>
          <Skeleton variant="circular" width={32} height={32} />
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Fade in={true} timeout={500}>
        <Box>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              Discover Amazing Content
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                mb: 4,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Explore videos and images shared by our creative community
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by title, location, or tags..."
              value={searchQuery}
              onChange={handleSearch}
              sx={{
                maxWidth: 600,
                mx: 'auto',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  height: 56,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.background.paper, 0.95),
                    '& fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  '&.Mui-focused': {
                    backgroundColor: theme.palette.background.paper,
                    '& fieldset': {
                      borderWidth: 2,
                      borderColor: theme.palette.primary.main,
                    },
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {loading && !media.length ? (
            <Grid container spacing={4}>
              {[1, 2, 3, 4, 5, 6].map((item) => renderSkeleton())}
            </Grid>
          ) : (
            <Fade in={true} timeout={500}>
              <Grid container spacing={4}>
                {media.map((item) => (
                  <Grid item key={item._id} xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        cursor: 'pointer',
                        borderRadius: 3,
                        background: alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: theme.shadows[8],
                          '& .media-overlay': {
                            opacity: 1,
                          },
                        },
                      }}
                    >
                      <CardActionArea onClick={() => handleMediaClick(item._id)}>
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component={item.type === 'video' ? 'video' : 'img'}
                            height="240"
                            image={item.url}
                            alt={item.title}
                            sx={{ 
                              objectFit: 'cover',
                              borderRadius: '16px 16px 0 0',
                            }}
                          />
                          <Box
                            className="media-overlay"
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: alpha(theme.palette.primary.main, 0.2),
                              backdropFilter: 'blur(4px)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: 0,
                              transition: 'all 0.3s ease-in-out',
                              borderRadius: '16px 16px 0 0',
                            }}
                          >
                            {item.type === 'video' ? (
                              <PlayCircle sx={{ color: 'white', fontSize: 64 }} />
                            ) : (
                              <ImageIcon sx={{ color: 'white', fontSize: 48 }} />
                            )}
                          </Box>
                          <Chip
                            icon={item.type === 'video' ? <VideoLibrary /> : <ImageIcon />}
                            label={item.type === 'video' ? 'Video' : 'Image'}
                            color="primary"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 16,
                              right: 16,
                              backdropFilter: 'blur(4px)',
                              backgroundColor: alpha(theme.palette.primary.main, 0.9),
                              '& .MuiChip-icon': {
                                color: 'white',
                              },
                            }}
                          />
                        </Box>
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          <Typography 
                            gutterBottom 
                            variant="h6" 
                            component="h2" 
                            noWrap 
                            sx={{ 
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                            }}
                          >
                            {item.title}
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
                              minHeight: '40px',
                              lineHeight: 1.6,
                            }}
                          >
                            {item.caption}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Rating
                              value={item.averageRating || 0}
                              readOnly
                              precision={0.5}
                              size="small"
                              sx={{
                                '& .MuiRating-iconFilled': {
                                  color: theme.palette.primary.main,
                                },
                              }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              ({item.ratings?.length || 0})
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <LocationOn fontSize="small" sx={{ color: theme.palette.primary.main }} />
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {item.location || 'No location'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                backgroundColor: theme.palette.primary.main,
                                fontSize: '1rem',
                              }}
                            >
                              {item.creator?.name?.[0]?.toUpperCase()}
                            </Avatar>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {item.creator?.name}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                            {item.tags?.map((tag, index) => (
                              <Chip
                                key={index}
                                label={tag}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderRadius: 1,
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
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Fade>
          )}

          {!searchQuery && totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    },
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </Fade>
    </Container>
  );
};

export default MediaGallery; 