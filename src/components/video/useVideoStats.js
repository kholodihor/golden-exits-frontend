import { useState, useRef, useCallback, useEffect } from 'react';
import { logger } from '@/utils/logger';
import { useSelector } from 'react-redux';
import axios from '@/utils/axios';

export const useVideoStats = ({ id, views, likes, videoRef }) => {
  const likeInFlightRef = useRef(false);
  const userId = useSelector(state => state?.auth?.data?._id);
  const [viewsCount, setViewsCount] = useState(views ?? 0);
  const viewsCountRef = useRef(views ?? 0);
  const [likesMap, setLikesMap] = useState(likes || {});

  useEffect(() => {
    setViewsCount(views ?? 0);
    viewsCountRef.current = views ?? 0;
  }, [views]);

  useEffect(() => {
    setLikesMap(likes || {});
  }, [likes]);

  const isLiked = Boolean(userId && likesMap[userId]);
  const likeCount = Object.keys(likesMap).length;

  const handleViewsCount = useCallback(async () => {
    if (videoRef.current?.currentTime <= 1) {
      const nextViews = viewsCountRef.current + 1;
      viewsCountRef.current = nextViews;
      setViewsCount(nextViews);
      try {
        // The server increments atomically and returns the real count.
        const { data } = await axios.post(`/videos/${id}/views`);
        viewsCountRef.current = data.views;
        setViewsCount(data.views);
      } catch (err) {
        logger.warn('Failed to update view count:', err);
      }
    }
  }, [id, videoRef]);

  const handleLike = useCallback(async () => {
    if (!userId || likeInFlightRef.current) return;
    likeInFlightRef.current = true;
    try {
      const { data } = await axios.patch(`/videos/${id}/like`);
      setLikesMap(prev => {
        const next = { ...prev };
        if (data.liked) {
          next[userId] = true;
        } else {
          delete next[userId];
        }
        return next;
      });
    } catch (error) {
      logger.warn('Failed to update like:', error);
    } finally {
      likeInFlightRef.current = false;
    }
  }, [id, userId]);

  return { userId, viewsCount, isLiked, likeCount, handleViewsCount, handleLike };
};
