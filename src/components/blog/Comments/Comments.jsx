import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment, getPostComments } from '@/redux/slices/comment';
import { useForm } from 'react-hook-form';
import { PostSkeleton } from '../Post/PostSkeleton';
import {UserInfo} from '@/components/common/UserInfo/UserInfo';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styles from './Comments.module.scss';

export const Comments = ({ postId, userId, setCommentsCount }) => {
  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.comment);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      comment: '',
    },
    mode: 'onChange',
  });

  const isCommentsLoading = setCommentsCount.status === 'loading';

  const onSubmit = (values, e) => {
    try {
      const comment = values.comment;
      dispatch(createComment({ postId, comment, userId }));
      setCommentsCount((prev) => prev + 1);
      e.target[0].value = '';
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getPostComments(postId));
  }, [postId, dispatch]);

  return (
    <div className={styles.Comments}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          className={styles.commentInput}
          cols="30"
          rows="2"
          placeholder="Add a Comment"
          error={errors.comment?.message}
          helperText={errors.comment?.message}
          {...register('comment', { required: 'Write a Comment' })}
        />
        <Button disabled={!isValid} type="submit" className={styles.button}>
          Add Comment
        </Button>
      </form>
      {(isCommentsLoading ? [...Array(2)] : comments).map((item, index) =>
        isCommentsLoading ? (
          <PostSkeleton key={index} />
        ) : (
          <div key={index} className={styles.comment}>
            <UserInfo {...item.user} createdAt={item.createdAt} />
            <div className={styles.content}>{item.comment}</div>
          </div>
        )
      )}
    </div>
  );
};

