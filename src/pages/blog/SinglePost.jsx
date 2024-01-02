import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { Link, useParams } from "react-router-dom";
import { Post } from "@/components/blog/Post/Post";
import { Container } from "@mui/material";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import { PostSkeleton } from "@/components/blog/Post/PostSkeleton";

export const SinglePost = () => {
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert(err.message);
      });
  }, [id]);

  return (
    <>
      {isLoading ? (
        <Container maxWidth="md" style={{ padding: "2rem 0" }}>
          <PostSkeleton />
        </Container>
      ) : (
        <>
          <Link to="/blog">
            <BsArrowLeftCircleFill className="homeIcon" />
          </Link>
          <Container maxWidth="md" style={{ padding: "2rem 0" }}>
            <Post
              id={data._id}
              title={data.title}
              text={data.text}
              imageUrl={data.imageUrl ? data.imageUrl : ""}
              user={data.user}
              createdAt={data.createdAt}
              likes={data.likes}
              comments={data.comments}
              isFullPost
            >
              <p style={{ fontSize: "1rem" }}>{data.text}</p>
            </Post>
          </Container>
        </>
      )}
    </>
  );
};
