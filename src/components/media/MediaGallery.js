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
  CircularProgress
} from '@mui/material';
import { Search, LocationOn, Person, VideoLibrary } from '@mui/icons-material';
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
    <Container sx={{ py: 4 }}>
      <Fade in={true} timeout={500}>
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by title, location, or tags..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Box>
      </Fade>

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
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      '& .media-overlay': {
                        opacity: 1,
                      },
                    },
                  }}
                  onClick={() => handleMediaClick(item._id)}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component={item.type === 'video' ? 'video' : 'img'}
                      height="200"
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
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s ease-in-out',
                      }}
                    >
                      <VideoLibrary sx={{ color: 'white', fontSize: 48 }} />
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2" noWrap>
                      {item.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {item.caption}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {item.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {item.creator?.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 'auto' }}>
                      {item.tags?.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{
                            '&:hover': {
                              backgroundColor: 'primary.light',
                              color: 'white',
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Fade>
      )}

      {!searchQuery && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
    </Container>
  );
};

export default MediaGallery; 