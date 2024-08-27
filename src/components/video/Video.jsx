import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "@/utils/axios";
import { UserInfo } from "@/components/common/UserInfo/UserInfo";
import { FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Paper } from "@mui/material";
import styles from "./Video.module.scss";

export const Video = ({
  id,
  title,
  genre,
  createdAt,
  videoUrl,
  user,
  views,
  likes,
}) => {
  const videoRef = useRef();
  const userId = useSelector((state) => state?.auth?.data?._id);
  const [viewsCount, setViewsCount] = useState(views);
  const [isLiked, setIsLiked] = useState(Boolean(likes[userId]));
  const [likeCount, setLikeCount] = useState(Object.keys(likes).length);

  const handleViewsCount = async () => {
    if (videoRef.current !== undefined && videoRef.current.currentTime <= 1) {
      setViewsCount((prev) => prev + 1);
      try {
        await axios.patch(`/videos/${id}`, {
          views: viewsCount,
        });
      } catch (err) {
        console.log(err);
        alert(err.message);
      }
    }
  };

  console.log(viewsCount);

  const handleLike = async () => {
    setIsLiked((prev) => (prev = !prev));
    try {
      await axios.patch(`videos/${id}/like`, {
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

  return (
    <Paper className={styles.Video}>
      {videoUrl && (
        <video
          className={styles.video}
          src={videoUrl}
          alt={title}
          muted
          controls
          preload="auto"
          onPlay={handleViewsCount}
          ref={videoRef}
        />
      )}
      <div className={styles.wrapper}>
        <div>
          <UserInfo {...user} additionalText={createdAt} />
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <p>{genre}</p>
        </div>
        <div className={styles.actions}>
          <div className={styles.likes} onClick={handleLike}>
            {isLiked ? <FavoriteOutlined /> : <FavoriteBorderOutlined />}
            <span> {likeCount}</span>
          </div>
          <div className={styles.views}>
            <VisibilityOutlinedIcon />
            <span> {viewsCount}</span>
          </div>
        </div>
      </div>
    </Paper>
  );
};
