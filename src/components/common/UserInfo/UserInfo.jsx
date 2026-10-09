import Avatar from '@mui/material/Avatar';
import styles from './UserInfo.module.scss';

const formatDate = dateString => {
  if (!dateString) return 'No date';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
};

export const UserInfo = ({ avatarUrl, username, createdAt, additionalText }) => {
  const formattedDate = additionalText || formatDate(createdAt);

  return (
    <div className={styles.UserInfo}>
      <div className={styles.avatar}>
        <Avatar
          src={avatarUrl}
          alt={username || 'User'}
          sx={{
            width: 40,
            height: 40,
            backgroundColor: 'rgba(208, 175, 81, 0.1)',
            color: '#d0af51',
          }}
        />
      </div>
      <div className={styles.userDetails}>
        <span className={styles.userName}>{username || 'Anonymous'}</span>
        <span className={styles.additional}>{formattedDate}</span>
      </div>
    </div>
  );
};
