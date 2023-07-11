import {  useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout, selectIsAuth } from '@/redux/slices/auth';
import { Paper, Button } from '@mui/material';
import Confirm from '@/components/common/Confirm/Confirm';
import styles from './Header.module.scss';

const Header = ({ title, buttonTitle, to }) => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const user = useSelector((state) => state.auth.data);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    subtitle: '',
  });

  
  const handleLogout = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Are you sure you want to log out?',
      subtitle: '',
      onConfirm: () => {
        logOut();
      },
    });
  };

  const logOut = () => {
    dispatch(logout());
    window.localStorage.removeItem('token');
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
  };

  return (
    <Paper>
      <div className={styles.Header}>
        <h1 className={styles.logo}>
          <span>Golden Exits</span> {title}
        </h1>
        <div className={styles.buttons}>
          {isAuth ? (
            <div className={styles.userActions}>
              <div className={styles.avatarBox}>
                <img
                  src={user.avatarUrl ? user.avatarUrl : '/noavatar.png'}
                  alt={user.username}
                />
              </div>
              <Link to={to}>
                <Button className={styles.button}>{buttonTitle}</Button>
              </Link>
              <Button onClick={handleLogout} className={styles.logout}>
                LogOut
              </Button>
            </div>
          ) : (
            <div className={styles.userActions}>
              <Link to="/login">
                <Button className={styles.button}>LogIn</Button>
              </Link>
              <Link to="/register">
                <Button className={styles.button}>Create Account</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <Confirm
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </Paper>
  );
};

export default Header;
