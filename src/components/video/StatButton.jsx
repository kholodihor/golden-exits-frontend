import { Box, IconButton, Tooltip, Typography } from '@mui/material';

export const StatButton = ({ tooltip, icon, count, active, onClick, clickable }) => {
  const cursor = clickable === undefined ? undefined : clickable ? 'pointer' : 'default';

  return (
    <Tooltip title={tooltip} arrow>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: active ? '#d0af51' : 'text.secondary',
          cursor,
        }}
        onClick={onClick}
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
          {icon}
        </IconButton>
        <Typography variant="body2" sx={{ minWidth: 20 }}>
          {count}
        </Typography>
      </Box>
    </Tooltip>
  );
};
