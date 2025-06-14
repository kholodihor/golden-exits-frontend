import { useState, useCallback } from 'react';
import { logger } from '@/utils/logger';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from '@/utils/axios';
import { UserInfo } from '@/components/common/UserInfo/UserInfo';
import { Comments } from '../Comments/Comments';
import { removePost } from '@/redux/slices/posts';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import { FavoriteBorderOutlined, FavoriteOutlined } from '@mui/icons-material';
import { Paper, Typography, Skeleton } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import styles from './Post.module.scss';
import Confirm from '@/components/common/Confirm/Confirm';

export const Post = ({
  id,
  title,
  text,
  createdAt,
  imageUrl,
  user,
  isEditable,
  likes = {},
  comments = [],
  isFullPost,
  isLoading,
}) => {
  const dispatch = useDispatch();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsCount, setCommentsCount] = useState(comments?.length);
  const userId = useSelector(state => state?.auth?.data?._id);
  const [isLiked, setIsLiked] = useState(Boolean(likes[userId]));
  const [likeCount, setLikeCount] = useState(Object.keys(likes).length || 0);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    subtitle: '',
    onConfirm: () => {},
  });

  const handleLike = useCallback(async () => {
    try {
      await axios.patch(`posts/${id}/like`, { userId });
      setIsLiked(prev => !prev);
      setLikeCount(prev => (isLiked ? prev - 1 : prev + 1));
    } catch (error) {
      logger.error('Error updating like:', error);
    }
  }, [id, userId, isLiked]);

  const handleRemove = useCallback(() => {
    setConfirmDialog({
      isOpen: true,
      title: 'Do you want to remove this post?',
      subtitle: 'This action cannot be undone',
      onConfirm: () => {
        dispatch(removePost(id))
          .unwrap()
          .then(() => {
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          })
          .catch(error => {
            logger.error('Error removing post:', error);
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          });
      },
    });
  }, [id, dispatch]);

  const toggleComments = useCallback(() => {
    setCommentsOpen(prev => !prev);
  }, []);

  if (isLoading) {
    return (
      <Paper className={styles.Post}>
        <Skeleton variant="rectangular" width="100%" height={300} />
        <div className={styles.wrapper}>
          <Skeleton variant="text" width={200} />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
        </div>
      </Paper>
    );
  }

  return (
    <>
      <Paper className={styles.Post}>
        {isEditable && (
          <div className={styles.editButtons}>
            <Link to={`/edit-post/${id}`}>
              <IconButton className={styles.edit} aria-label="Edit post">
                <EditIcon />
              </IconButton>
            </Link>
            <IconButton onClick={handleRemove} className={styles.delete} aria-label="Delete post">
              <DeleteIcon />
            </IconButton>
          </div>
        )}
        {imageUrl && <img className={styles.image} src={imageUrl} alt={title} loading="lazy" />}
        <div className={styles.wrapper}>
          <div className={styles.wrapperHeader}>
            <UserInfo {...user} createdAt={createdAt} />
            <div className={styles.actions}>
              <div className={styles.comments} onClick={toggleComments}>
                <IconButton aria-label="Comments">
                  <CommentIcon />
                </IconButton>
                <span>{commentsCount}</span>
              </div>
              <div className={styles.likes}>
                <IconButton onClick={handleLike} aria-label="Like post">
                  {isLiked ? (
                    <FavoriteOutlined style={{ color: 'var(--red)' }} />
                  ) : (
                    <FavoriteBorderOutlined style={{ color: 'var(--red)' }} />
                  )}
                </IconButton>
                <span>{likeCount}</span>
              </div>
            </div>
          </div>
          <Typography variant="h5" component="h2" className={styles.title}>
            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
          </Typography>
          <Typography variant="body1" className={styles.text}>
            {isFullPost ? text : text.slice(0, 100) + (text.length > 100 ? '...' : '')}
          </Typography>
        </div>
      </Paper>
      {commentsOpen && (
        <Comments
          postId={id}
          onCommentAdd={() => setCommentsCount(prev => prev + 1)}
          onCommentRemove={() => setCommentsCount(prev => prev - 1)}
        />
      )}
      <Confirm
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        subtitle={confirmDialog.subtitle}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};
