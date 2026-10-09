import { useState, useRef } from 'react';
import { UserInfo } from '@/components/common/UserInfo/UserInfo';
import { FavoriteBorderOutlined, FavoriteOutlined, VisibilityOutlined } from '@mui/icons-material';
import { Paper, Typography, Box, Chip } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import styles from './Video.module.scss';
import { useVideoStats } from './useVideoStats';
import { VideoPlayer } from './VideoPlayer';
import { VideoOwnerMenu } from './VideoOwnerMenu';
import { StatButton } from './StatButton';

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
}) => {
  const videoRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const { userId, viewsCount, isLiked, likeCount, handleViewsCount, handleLike } = useVideoStats({
    id,
    views,
    likes,
    videoRef,
  });

  const createdAtDate = createdAt ? new Date(createdAt) : null;
  const createdAtText =
    createdAtDate && !Number.isNaN(createdAtDate.getTime())
      ? formatDistanceToNow(createdAtDate, { addSuffix: true })
      : '';

  const handlePlay = () => {
    setHasStarted(true);
    handleViewsCount();
  };

  return (
    <Paper
      elevation={2}
      className={styles.Video}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {videoUrl && (
        <VideoPlayer
          videoRef={videoRef}
          videoUrl={videoUrl}
          title={title}
          showControls={isHovered || hasStarted}
          showOverlay={!isHovered && !hasStarted}
          onPlay={handlePlay}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isEditable && <VideoOwnerMenu id={id} onRemove={onRemove} />}
        </VideoPlayer>
      )}
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <UserInfo {...user} additionalText={createdAtText} />
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
          <StatButton
            tooltip={!userId ? 'Login to like' : isLiked ? 'Unlike' : 'Like'}
            icon={isLiked ? <FavoriteOutlined /> : <FavoriteBorderOutlined />}
            count={likeCount}
            active={isLiked}
            onClick={handleLike}
            clickable={Boolean(userId)}
          />
          <StatButton
            tooltip="Views"
            icon={<VisibilityOutlined />}
            count={viewsCount}
            active={false}
          />
        </Box>
      </Box>
    </Paper>
  );
};
