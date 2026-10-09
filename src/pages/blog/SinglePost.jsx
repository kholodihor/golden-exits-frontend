import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { logger } from '@/utils/logger';
import axios from '@/utils/axios';
import { Link, useParams } from 'react-router-dom';
import { Post } from '@/components/blog/Post/Post';
import { Container, Alert } from '@mui/material';
import { BsArrowLeftCircleFill } from 'react-icons/bs';
import { PostSkeleton } from '@/components/blog/Post/PostSkeleton';

export const SinglePost = () => {
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const userId = useSelector(state => state?.auth?.data?._id);

  useEffect(() => {
    // Ignore responses that arrive after `id` changed or the component unmounted.
    let ignore = false;
    setLoading(true);
    setError('');

    axios
      .get(`/posts/${id}`)
      .then(res => {
        if (ignore) return;
        setData(res.data);
      })
      .catch(err => {
        if (ignore) return;
        logger.warn(err);
        setError(err.response?.data?.message || err.message || 'Failed to load post');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <>
      {isLoading ? (
        <Container maxWidth="md" style={{ padding: '2rem 0' }}>
          <PostSkeleton />
        </Container>
      ) : (
        <>
          <Link to="/blog">
            <BsArrowLeftCircleFill className="homeIcon" />
          </Link>
          <Container maxWidth="md" style={{ padding: '2rem 0' }}>
            {error || !data ? (
              <Alert severity="error">{error || 'Post not found'}</Alert>
            ) : (
              <Post
                key={data._id}
                id={data._id}
                title={data.title}
                text={data.text}
                imageUrl={data.imageUrl ? data.imageUrl : ''}
                user={data.user}
                createdAt={data.createdAt}
                likes={data.likes}
                comments={data.comments}
                isEditable={Boolean(userId) && userId === data.user?._id}
                isFullPost
              />
            )}
          </Container>
        </>
      )}
    </>
  );
};
