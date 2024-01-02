import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "@/redux/slices/posts";
import { selectIsAuth } from "@/redux/slices/auth";
import { Container, Grid } from "@mui/material";
import { Post } from "@/components/blog/Post/Post";
import { BlogAside } from "@/components/blog/BlogAside/BlogAside";
import { PostSkeleton } from "@/components/blog/Post/PostSkeleton";
import Header from "@/components/common/Header/Header";
import Intro from "@/components/common/Intro/Intro";
import Error from "@/components/common/Error/Error";

export const Blog = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector((state) => state?.auth?.data);
  const { posts } = useSelector((state) => state.posts);

  const isPostsLoading = posts.status === "loading";

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (posts.status === "error") return <Error />;

  return (
    <>
      <Intro />
      <Container maxWidth="xl">
        <Header title={"Blog"} buttonTitle={"write a post"} to={"/add-post"} />
        {!isAuth && (
          <p
            style={{
              textAlign: "center",
              color: "#d0af51",
              marginBottom: "1rem",
            }}
          >
            Login to write the post 😊
          </p>
        )}
        <Grid container spacing={2}>
          <Grid xs={12} md={7} item>
            {(isPostsLoading ? [...Array(3)] : posts.items).map((post, index) =>
              isPostsLoading ? (
                <PostSkeleton key={index} />
              ) : (
                <Post
                  key={post._id}
                  id={post._id}
                  title={post.title}
                  text={post.text}
                  likes={post.likes}
                  comments={post.comments}
                  imageUrl={post.imageUrl ? post.imageUrl : ""}
                  user={post.user}
                  createdAt={post.createdAt}
                  isEditable={userData?._id === post.user._id}
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
