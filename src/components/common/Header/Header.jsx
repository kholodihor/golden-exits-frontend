import { useState } from "react";
import { useIsAuth } from "@/hooks/useIsAuth";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "@/redux/slices/auth";
import { Paper, Button, Avatar, Box, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import { LogoutOutlined, PersonOutlineOutlined, AddCircleOutlineOutlined } from "@mui/icons-material";
import Confirm from "@/components/common/Confirm/Confirm";
import styles from "./Header.module.scss";

const Header = ({ title, buttonTitle, to }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.data);
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subtitle: "",
  });

  const isAuth = useIsAuth();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    setConfirmDialog({
      isOpen: true,
      title: "Are you sure you want to log out?",
      subtitle: "",
      onConfirm: () => {
        logOut();
      },
    });
  };

  const logOut = () => {
    dispatch(logout());
    window.localStorage.removeItem("token");
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
  };

  return (
    <Paper elevation={0} sx={{ borderRadius: 0, backgroundColor: 'transparent' }}>
      <Box className={styles.Header}>
        <h1 className={styles.logo}>
          <span>Golden Exits</span> {title}
        </h1>
        <Box className={styles.buttons}>
          {isAuth ? (
            <Box className={styles.userActions}>
              <Tooltip title={user?.username || 'Profile'} arrow>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    padding: 0.5,
                    border: '1px solid #d0af51',
                    '&:hover': {
                      border: '1px solid #e5c362',
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <Avatar
                    src={user?.avatarUrl}
                    alt={user?.username}
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: 'rgba(208, 175, 81, 0.1)',
                      color: '#d0af51'
                    }}
                  >
                    {user?.username?.[0]?.toUpperCase() || <PersonOutlineOutlined />}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    minWidth: 180,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(208, 175, 81, 0.3)'
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {buttonTitle && to && (
                  <MenuItem
                    component={Link}
                    to={to}
                    onClick={handleMenuClose}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemIcon>
                      <AddCircleOutlineOutlined fontSize="small" sx={{ color: '#d0af51' }} />
                    </ListItemIcon>
                    <ListItemText primary={buttonTitle} />
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <LogoutOutlined fontSize="small" sx={{ color: '#ff3b30' }} />
                  </ListItemIcon>
                  <ListItemText primary="Logout" sx={{ color: '#ff3b30' }} />
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{
                  borderColor: '#d0af51',
                  color: '#d0af51',
                  '&:hover': {
                    borderColor: '#e5c362',
                    backgroundColor: 'rgba(208, 175, 81, 0.04)'
                  }
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  backgroundColor: '#d0af51',
                  '&:hover': {
                    backgroundColor: '#e5c362'
                  }
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      <Confirm
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        subtitle={confirmDialog.subtitle}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
    </Paper>
  );
};

export default Header;
