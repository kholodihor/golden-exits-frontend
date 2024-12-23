import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideos } from "@/redux/slices/videos";
import { selectIsAuth } from "@/redux/slices/auth";
import { Container, Typography, Box } from "@mui/material";
import { BlogAside } from "@/components/blog/BlogAside/BlogAside";
import { PostSkeleton } from "@/components/blog/Post/PostSkeleton";
import { Video } from "@/components/video/Video";
import Intro from "@/components/common/Intro/Intro";
import Header from "@/components/common/Header/Header";
import Error from "@/components/common/Error/Error";
import Grid from "@mui/material/Grid";

export const VideoPage = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector((state) => state?.auth?.data);
  const { videos } = useSelector((state) => state.videos);

  const isVideosLoading = videos.status === "loading";

  useEffect(() => {
    dispatch(fetchVideos());
  }, [dispatch]);

  if (videos.status === "error") return <Error />;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Intro />
      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 2, md: 4 },
          px: { xs: 1, sm: 2, md: 3 }
        }}
      >
        <Header
          title={"Video"}
          buttonTitle={"upload a video"}
          to={"/video/upload"}
        />
        {!isAuth && (
          <Typography
            variant="body1"
            align="center"
            sx={{
              mb: 2,
              color: '#d0af51',
              fontStyle: 'italic'
            }}
          >
            Login to upload a video 😊
          </Typography>
        )}
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          sx={{
            flexDirection: { xs: 'column-reverse', md: 'row' }
          }}
        >
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 2, md: 3 }
            }}
          >
            {(isVideosLoading ? [...Array(3)] : videos.items).map(
              (video, index) =>
                isVideosLoading ? (
                  <PostSkeleton key={index} />
                ) : (
                  <Video
                    key={video._id}
                    id={video._id}
                    title={video.title}
                    user={video.user}
                    genre={video.genre}
                    createdAt={video.createdAt}
                    views={video.views}
                    likes={video.likes}
                    isEditable={userData?._id === video.user._id}
                    videoUrl={video.url ? video.url : ""}
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
              top: { md: '20px' },
              alignSelf: { md: 'flex-start' }
            }}
          >
            <BlogAside />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
