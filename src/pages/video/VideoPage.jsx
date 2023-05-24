import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideos } from '@/redux/slices/videos';
import { selectIsAuth } from '@/redux/slices/auth';
import { Container } from '@mui/material';
import { BlogAside } from '@/components/blog/BlogAside/BlogAside';
import { PostSkeleton } from '@/components/blog/Post/PostSkeleton';
import { Video } from '@/components/video/Video';
import Intro from '@/components/common/Intro/Intro';
import Header from '@/components/common/Header/Header';
import Error from '@/components/common/Error/Error';
import Grid from '@mui/material/Grid';

export const VideoPage = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector((state) => state?.auth?.data);
  const { videos } = useSelector((state) => state.videos);

  const isVideosLoading = videos.status === 'loading';

  useEffect(() => {
    dispatch(fetchVideos());
  }, [dispatch]);

  if (videos.status === 'error') return <Error />;

  return (
    <>
      <Intro />
      <Container maxWidth="xl">
        <Header
          title={'Video'}
          buttonTitle={'upload a video'}
          to={'/video/upload'}
        />
        {!isAuth && (
          <p style={{ textAlign: 'center', color: '#d0af51' }}>
            Login to upload the video ☺️
          </p>
        )}
        <Grid container spacing={2}>
          <Grid xs={12} md={7} item>
            {(isVideosLoading ? [...Array(3)] : videos.items).map(
              (video, index) =>
                isVideosLoading ? (
                  <PostSkeleton key={index} />
                ) : (
                  <Video
                    key={index}
                    id={video._id}
                    title={video.title}
                    user={video.user}
                    genre={video.genre}
                    createdAt={video.createdAt}
                    views={video.views}
                    likes={video.likes}
                    isEditable={userData?._id === video.user._id}
                    videoUrl={
                      video.url
                        ? `${import.meta.env.VITE_APP_API_URL}${video.url}`
                        : ''
                    }
                  />
                )
            )}
          </Grid>
          <Grid xs={12} md={5} item>
            <BlogAside />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
