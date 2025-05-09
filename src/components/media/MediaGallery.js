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
  Avatar
} from '@mui/material';
import {
  Search,
  LocationOn,
  Person,
  VideoLibrary,
  PlayCircle,
  Image as ImageIcon
} from '@mui/icons-material';
import { fetchMedia, searchMedia } from '../../store/slices/mediaSlice';

const MediaGallery = () => {
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
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Skeleton variant="rectangular" height={200} />
        <CardContent>
          <Skeleton variant="text" height={32} />
          <Skeleton variant="text" height={24} />
          <Skeleton variant="text" height={24} />
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Skeleton variant="rectangular" width={60} height={24} />
            <Skeleton variant="rectangular" width={60} height={24} />
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in={true} timeout={500}>
        <Box>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
              Discover Amazing Content
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
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
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.paper',
                  borderRadius: 3,
                  height: 56,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="primary" />
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
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
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
                            sx={{ objectFit: 'cover' }}
                          />
                          <Box
                            className="media-overlay"
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: 'rgba(0, 0, 0, 0.4)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: 0,
                              transition: 'opacity 0.3s ease-in-out',
                            }}
                          >
                            {item.type === 'video' ? (
                              <PlayCircle sx={{ color: 'white', fontSize: 64 }} />
                            ) : (
                              <ImageIcon sx={{ color: 'white', fontSize: 48 }} />
                            )}
                          </Box>
                          <Chip
                            label={item.type === 'video' ? 'Video' : 'Image'}
                            color="primary"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 16,
                              right: 16,
                              backgroundColor: 'rgba(124, 77, 255, 0.9)',
                            }}
                          />
                        </Box>
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          <Typography gutterBottom variant="h6" component="h2" noWrap sx={{ fontWeight: 600 }}>
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
                            />
                            <Typography variant="body2" color="text.secondary">
                              ({item.ratings?.length || 0})
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <LocationOn fontSize="small" color="primary" />
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {item.location || 'No location'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                backgroundColor: 'primary.main',
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
                                  '&:hover': {
                                    backgroundColor: 'primary.light',
                                    color: 'white',
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
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