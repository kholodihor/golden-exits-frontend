import { useState } from 'react';
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
import { Paper } from '@mui/material';
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
  likes,
  comments,
  isFullPost,
}) => {
  const dispatch = useDispatch();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsCount, setCommentsCount] = useState(comments?.length);
  const userId = useSelector((state) => state?.auth?.data?._id);
  const [isLiked, setIsLiked] = useState(Boolean(likes[userId]));
  const [likeCount, setLikeCount] = useState(Object.keys(likes).length || 0);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    subtitle: '',
  });

  const handleLike = async () => {
    setIsLiked((prev) => (prev = !prev));
    try {
      await axios.patch(`posts/${id}/like`, {
        userId,
      });
      if (!isLiked) {
        setLikeCount((prev) => prev + 1);
      } else {
        setLikeCount((prev) => prev - 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'You want to remove the post?',
      subtitle: 'You can`t undo this action',
      onConfirm: () => {
        deletePost();
      },
    });
  };

  const deletePost = () => {
    dispatch(removePost(id));
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
  };

  return (
    <>
      <Paper className={styles.Post}>
        {isEditable && (
          <div className={styles.editButtons}>
            <Link to={`/edit-post/${id}`}>
              <IconButton className={styles.edit}>
                <EditIcon />
              </IconButton>
            </Link>
            <IconButton onClick={handleRemove} className={styles.delete}>
              <DeleteIcon />
            </IconButton>
          </div>
        )}
        <img className={styles.image} src={imageUrl} alt={title} />
        <div className={styles.wrapper}>
          <div className={styles.wrapperheader}>
            <UserInfo {...user} createdAt={createdAt} />
            <div className={styles.actions}>
              <div
                className={styles.comments}
                onClick={() => setCommentsOpen(!commentsOpen)}
              >
                <CommentIcon />
                <span> {commentsCount}</span>
              </div>
              <div className={styles.likes} onClick={handleLike}>
                {isLiked ? <FavoriteOutlined /> : <FavoriteBorderOutlined />}
                <span> {likeCount}</span>
              </div>
            </div>
          </div>
          <div>
            <h2 className={styles.title}>{title}</h2>
            {!isFullPost ? (
              <Link to={`/posts/${id}`} className={styles.link}>
                Read More...
              </Link>
            ) : (
              <p>{text}</p>
            )}
          </div>
          {commentsOpen ? (
            <Comments
              comments={comments}
              user={user}
              postId={id}
              userId={userId}
              setCommentsCount={setCommentsCount}
            />
          ) : null}
        </div>
      </Paper>
      <Confirm
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
};
