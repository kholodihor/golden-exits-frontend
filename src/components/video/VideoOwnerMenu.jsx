import { useState } from 'react';
import { Box, IconButton, Fade, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { EditOutlined, DeleteOutlined } from '@mui/icons-material';

export const VideoOwnerMenu = ({ id, onRemove }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleMenuClose();
    onRemove?.(id);
  };

  return (
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
  );
};
