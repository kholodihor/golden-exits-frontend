import { useState, useRef, useCallback } from 'react';
import { logger } from '@/utils/logger';
import { useSelector } from 'react-redux';
import axios from '@/utils/axios';
import { UserInfo } from '@/components/common/UserInfo/UserInfo';
import {
  FavoriteBorderOutlined,
  FavoriteOutlined,
  VisibilityOutlined,
  PlayArrowRounded,
  EditOutlined,
  DeleteOutlined,
} from '@mui/icons-material';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Chip,
  Tooltip,
  Fade,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import styles from './Video.module.scss';

export const Video = ({
  id,
  title,
  genre,
  createdAt,
  videoUrl,
  user,
  views,
  likes,
  isEditable,
  onRemove,
  onEdit,
}) => {
  const videoRef = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const userId = useSelector(state => state?.auth?.data?._id);
  const [viewsCount, setViewsCount] = useState(views);
  const [isLiked, setIsLiked] = useState(Boolean(likes[userId]));
  const [likeCount, setLikeCount] = useState(Object.keys(likes).length);

  const handleViewsCount = useCallback(async () => {
    if (videoRef.current?.currentTime <= 1) {
      setViewsCount(prev => prev + 1);
      try {
        await axios.patch(`/videos/${id}`, {
          views: viewsCount,
        });
      } catch (err) {
        logger.warn('Failed to update view count:', err);
      }
    }
  }, [id, viewsCount]);

  const handleLike = useCallback(async () => {
    try {
      await axios.patch(`videos/${id}/like`, { userId });
      setIsLiked(prev => !prev);
      setLikeCount(prev => prev + (isLiked ? -1 : 1));
    } catch (error) {
      logger.warn('Failed to update like:', error);
    }
  }, [id, userId, isLiked]);

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit?.(id);
  };

  const handleDelete = () => {
    handleMenuClose();
    onRemove?.(id);
  };

  return (
    <Paper
      elevation={2}
      className={styles.Video}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme => theme.shadows[8],
        },
      }}
    >
      {videoUrl && (
        <Box
          sx={{
            position: 'relative',
            paddingTop: '56.25%',
            backgroundColor: '#000',
            cursor: 'pointer',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <video
            className={styles.video}
            src={videoUrl}
            alt={title}
            muted
            controls={isHovered}
            preload="metadata"
            onPlay={handleViewsCount}
            ref={videoRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <Fade in={!isHovered}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.3)',
                transition: 'opacity 0.3s ease',
              }}
            >
              <IconButton
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    backgroundColor: '#fff',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <PlayArrowRounded fontSize="large" />
              </IconButton>
            </Box>
          </Fade>
          {isEditable && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 1,
              }}
            >
              <IconButton
                size="small"
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid #d0af51',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    transform: 'scale(1.05)',
                    border: '1px solid #e5c362',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
                onClick={handleMenuOpen}
              >
                <EditOutlined fontSize="small" sx={{ color: '#d0af51' }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                TransitionComponent={Fade}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1,
                    minWidth: 120,
                    borderRadius: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(208, 175, 81, 0.3)',
                  },
                }}
              >
                <MenuItem
                  onClick={handleEdit}
                  sx={{
                    py: 1,
                    '&:hover': { backgroundColor: 'rgba(208, 175, 81, 0.1)' },
                  }}
                >
                  <ListItemIcon>
                    <EditOutlined fontSize="small" sx={{ color: '#d0af51' }} />
                  </ListItemIcon>
                  <ListItemText primary="Edit" sx={{ color: '#d0af51' }} />
                </MenuItem>
                <MenuItem
                  onClick={handleDelete}
                  sx={{
                    py: 1,
                    '&:hover': { backgroundColor: 'rgba(255, 59, 48, 0.1)' },
                  }}
                >
                  <ListItemIcon>
                    <DeleteOutlined fontSize="small" sx={{ color: '#ff3b30' }} />
                  </ListItemIcon>
                  <ListItemText primary="Delete" sx={{ color: '#ff3b30' }} />
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      )}
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <UserInfo
            {...user}
            additionalText={formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              mb: 1,
              fontWeight: 600,
              color: 'text.primary',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
          <Chip
            label={genre}
            size="small"
            sx={{
              backgroundColor: 'rgba(208, 175, 81, 0.1)',
              color: '#d0af51',
              fontWeight: 500,
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Tooltip title={isLiked ? 'Unlike' : 'Like'} arrow>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: isLiked ? '#d0af51' : 'text.secondary',
                cursor: 'pointer',
              }}
              onClick={handleLike}
            >
              <IconButton
                size="small"
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid #d0af51',
                  color: '#d0af51',
                  p: 0.5,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    transform: 'scale(1.05)',
                    border: '1px solid #e5c362',
                    color: '#e5c362',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {isLiked ? <FavoriteOutlined /> : <FavoriteBorderOutlined />}
              </IconButton>
              <Typography variant="body2" sx={{ minWidth: 20 }}>
                {likeCount}
              </Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Views" arrow>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'text.secondary',
              }}
            >
              <IconButton
                size="small"
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid #d0af51',
                  color: '#d0af51',
                  p: 0.5,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    transform: 'scale(1.05)',
                    border: '1px solid #e5c362',
                    color: '#e5c362',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <VisibilityOutlined />
              </IconButton>
              <Typography variant="body2" sx={{ minWidth: 20 }}>
                {viewsCount}
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
};
