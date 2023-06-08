import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getNews } from '@/redux/slices/news';
import { PostSkeleton } from '@/components/blog/Post/PostSkeleton';
import styles from './BlogAside.module.scss';

export const BlogAside = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [showedNews, setShowedNews] = useState([]);
  const { news } = useSelector((state) => state.news);
  const { posts } = useSelector((state) => state.posts);
  const { videos } = useSelector((state) => state.videos);

  const isNewsLoading = news.status === 'loading';

  useEffect(() => {
    dispatch(getNews());
  }, [dispatch]);

  useEffect(() => {
    if (location.pathname === '/blog') {
      const sliced = news.slice(0, posts.items.length ? posts.items.length : 2);
      setShowedNews(sliced);
    } else if (location.pathname === '/video') {
      const sliced = news.slice(
        0,
        videos.items.length ? videos.items.length : 2
      );
      setShowedNews(sliced);
    }
  }, [location.pathname, posts.items.length, videos.items.length]);

  return (
    <aside className={styles.BlogAside}>
      {(isNewsLoading ? [...Array(5)] : showedNews).map((article, index) =>
        isNewsLoading ? (
          <PostSkeleton key={index} />
        ) : (
          <article className={styles.article} key={article._id}>
            <div className={styles.flex}>
              <div className={styles.image}>
                <img src={article.imageUrl} alt={article.title} />
              </div>
              <h2 className={styles.post_title}>{article.title}</h2>
            </div>
            <p className={styles.post_text}>{article.content}</p>
            <div className={styles.postfooter}>
              <cite>by Cold</cite>
              <span className={styles.post_date}>
                {new Date(Date.now()).toLocaleString()}
              </span>
            </div>
          </article>
        )
      )}
    </aside>
  );
};
