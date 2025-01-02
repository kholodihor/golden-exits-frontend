import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '@/redux/slices/posts';
import { selectIsAuth } from '@/redux/slices/auth';
import { Container, Grid, Typography, Box } from '@mui/material';
import { Post } from '@/components/blog/Post/Post';
import { BlogAside } from '@/components/blog/BlogAside/BlogAside';
import { PostSkeleton } from '@/components/blog/Post/PostSkeleton';
import Header from '@/components/common/Header/Header';
import Intro from '@/components/common/Intro/Intro';
import Error from '@/components/common/Error/Error';

export const Blog = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector(state => state?.auth?.data);
  const { posts } = useSelector(state => state.posts);

  const isPostsLoading = posts.status === 'loading';

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (posts.status === 'error') return <Error />;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Intro />
      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 2, md: 4 },
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Header title="Blog" buttonTitle="Write a post" to="/add-post" />
        {!isAuth && (
          <Typography
            variant="body1"
            align="center"
            color="primary"
            sx={{
              mb: 2,
              color: '#d0af51',
              fontStyle: 'italic',
            }}
          >
            Login to write the post 😊
          </Typography>
        )}
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          sx={{
            flexDirection: { xs: 'column-reverse', md: 'row' },
          }}
        >
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 2, md: 3 },
            }}
          >
            {(isPostsLoading ? [...Array(3)] : posts.items).map((post, index) =>
              isPostsLoading ? (
                <PostSkeleton key={index} />
              ) : (
                <Post
                  key={post._id}
                  id={post._id}
                  title={post.title}
                  text={post.text}
                  imageUrl={post.imageUrl}
                  user={post.user}
                  createdAt={post.createdAt}
                  likes={post.likes}
                  comments={post.comments}
                  isEditable={userData?._id === post.user._id}
                />
              )
            )}
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            lg={3}
            sx={{
              position: { md: 'sticky' },
              top: { md: 20 },
              alignSelf: { md: 'flex-start' },
            }}
          >
            <BlogAside />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
