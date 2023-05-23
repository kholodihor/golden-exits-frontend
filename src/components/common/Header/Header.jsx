import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout, selectIsAuth } from '@/redux/slices/auth';
import { Paper, Button } from '@mui/material';
import styles from './Header.module.scss';

const Header = ({ title, buttonTitle, to }) => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const user = useSelector((state) => state.auth.data);

  const onClickLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
    }
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
                <img src={user.avatarUrl} alt={user.username} />
              </div>
              <Link to={to}>
                <Button className={styles.button}>{buttonTitle}</Button>
              </Link>
              <Button onClick={onClickLogout} className={styles.logout}>
                LogOut
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button className={styles.button}>LogIn</Button>
              </Link>
              <Link to="/register">
                <Button className={styles.button}>Create Account</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </Paper>
  );
};

export default Header;
