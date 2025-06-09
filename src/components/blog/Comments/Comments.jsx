import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment, getPostComments } from '@/redux/slices/comment';
import { useForm } from 'react-hook-form';
import { logger } from '@/utils/logger';
import { PostSkeleton } from '../Post/PostSkeleton';
import { UserInfo } from '@/components/common/UserInfo/UserInfo';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styles from './Comments.module.scss';

export const Comments = ({ postId, _userId, onCommentAdd, _onCommentRemove }) => {
  const dispatch = useDispatch();
  const commentState = useSelector(state => state.comment);
  const { comments } = commentState;
  const currentUser = useSelector(state => state.auth.data);

  console.log('Comments component - postId:', postId);
  console.log('Comments component - Redux comment state:', commentState);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      comment: '',
    },
    mode: 'onChange',
  });

  // Use loading state from Redux store
  const { loading } = useSelector(state => state.comment);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async values => {
    if (!currentUser) {
      logger.warn('User must be logged in to comment');
      return;
    }

    try {
      setSubmitting(true);
      const comment = values.comment;

      await dispatch(
        createComment({
          postId,
          comment,
          userId: currentUser._id,
          user: {
            username: currentUser.username || 'User',
            avatarUrl: currentUser.avatarUrl || '',
            fullName: currentUser.fullName || '',
          },
        })
      ).unwrap();

      onCommentAdd && onCommentAdd();
      reset({ comment: '' });
    } catch (error) {
      logger.error('Failed to add comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // Make sure we have a valid postId before fetching comments
    if (postId) {
      dispatch(getPostComments(postId));
    }
  }, [postId, dispatch]);

  // Render comments with proper user data handling
  const renderComments = () => {
    if (!comments || comments.length === 0) {
      return <div className={styles.noComments}>No comments yet</div>;
    }

    return comments.map((item, index) => {
      // Handle different comment structure formats
      const commentData = item.newComment || item;

      // Handle different user data formats
      // If user is an object, use it directly; if it's an ID, use currentUser as fallback
      // This ensures we use the same avatar URL format as in the Header component
      const userData = typeof commentData.user === 'object' ? commentData.user : currentUser;

      return (
        <div key={index} className={styles.comment}>
          <UserInfo
            avatarUrl={userData?.avatarUrl}
            username={userData?.username || 'User'}
            createdAt={commentData.createdAt}
          />
          <div className={styles.content}>{commentData.comment}</div>
        </div>
      );
    });
  };

  return (
    <div className={styles.Comments}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Comment"
          variant="outlined"
          fullWidth
          error={Boolean(errors.comment?.message)}
          helperText={errors.comment?.message}
          disabled={submitting}
          {...register('comment', { required: 'Please enter a comment' })}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={!isValid || submitting}
          sx={{ mt: 2, bgcolor: '#d0af51', '&:hover': { bgcolor: '#b89c46' } }}
        >
          {submitting ? 'Posting...' : 'Add Comment'}
        </Button>
      </form>
      {loading ? (
        <>
          <PostSkeleton />
          <PostSkeleton />
        </>
      ) : (
        renderComments()
      )}
    </div>
  );
};
