import Avatar from '@mui/material/Avatar';
import styles from './UserInfo.module.scss';

export const UserInfo = ({ avatarUrl, username, createdAt }) => {
  // Safely format the date or return a fallback
  const formatDate = dateString => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      // Check if date is valid
      return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const formattedDate = formatDate(createdAt);

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
        >
          {/* {!avatarUrl && username?.[0]?.toUpperCase()} */}
        </Avatar>
      </div>
      <div className={styles.userDetails}>
        <span className={styles.userName}>{username || 'Anonymous'}</span>
        <span className={styles.additional}>{formattedDate}</span>
      </div>
    </div>
  );
};
