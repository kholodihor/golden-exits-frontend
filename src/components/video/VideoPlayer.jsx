import { Box, IconButton, Fade } from '@mui/material';
import { PlayArrowRounded } from '@mui/icons-material';
import { logger } from '@/utils/logger';
import styles from './Video.module.scss';

export const VideoPlayer = ({
  videoRef,
  videoUrl,
  title,
  showControls,
  showOverlay,
  onPlay,
  onMouseEnter,
  onMouseLeave,
  children,
}) => {
  const handlePlayClick = () => {
    const playPromise = videoRef.current?.play();
    playPromise?.catch?.(err => logger.warn('Failed to play video:', err));
  };

  return (
    <Box
      sx={{
        position: 'relative',
        paddingTop: '56.25%',
        backgroundColor: '#000',
        cursor: 'pointer',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <video
        className={styles.video}
        src={videoUrl}
        aria-label={title}
        muted
        controls={showControls}
        preload="metadata"
        onPlay={onPlay}
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
      <Fade in={showOverlay}>
        <Box
          onClick={handlePlayClick}
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
          }}
        >
          <IconButton
            aria-label="Play video"
            onClick={event => {
              event.stopPropagation();
              handlePlayClick();
            }}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            }}
          >
            <PlayArrowRounded fontSize="large" />
          </IconButton>
        </Box>
      </Fade>
      {children}
    </Box>
  );
};
