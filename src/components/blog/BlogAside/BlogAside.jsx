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

  const { news } = useSelector(state => state.news);
  const { posts } = useSelector(state => state.posts);
  const { videos } = useSelector(state => state.videos);

  const isNewsLoading = news.status === 'loading';

  useEffect(() => {
    dispatch(getNews());
  }, [dispatch]);

  useEffect(() => {
    if (!news.items) return;

    if (location.pathname === '/blog') {
      const sliced = news.items.slice(0, posts?.items?.length || 2);
      setShowedNews(sliced);
    } else if (location.pathname === '/video') {
      const sliced = news.items.slice(0, videos?.items?.length || 2);
      setShowedNews(sliced);
    }
  }, [location.pathname, news.items, posts?.items?.length, videos?.items?.length]);

  if (news.status === 'failed') {
    return (
      <aside className={styles.BlogAside}>
        <p className={styles.error}>Failed to load news: {news.error}</p>
      </aside>
    );
  }

  return (
    <aside className={styles.BlogAside}>
      {(isNewsLoading ? [...Array(5)] : showedNews).map((article, index) =>
        isNewsLoading ? (
          <PostSkeleton key={index} />
        ) : (
          <article className={styles.article} key={article._id}>
            <div className={styles.imageContainer}>
              {article.imageUrl ? (
                <img src={article.imageUrl} alt={article.title} loading="lazy" />
              ) : (
                <div className={styles.placeholderImage}></div>
              )}
            </div>
            <div className={styles.contentContainer}>
              <h2 className={styles.title}>{article.title}</h2>
              <p className={styles.excerpt}>
                {article.content.length > 120
                  ? `${article.content.substring(0, 120)}...`
                  : article.content}
              </p>
              <div className={styles.footer}>
                <span className={styles.date}>
                  {new Date(article.createdAt).toLocaleDateString()}
                </span>
                <span className={styles.author}>{article.author || 'Kholod Ihor'}</span>
              </div>
            </div>
          </article>
        )
      )}
    </aside>
  );
};
