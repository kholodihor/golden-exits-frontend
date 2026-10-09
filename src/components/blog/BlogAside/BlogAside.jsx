import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getNews, selectNews, selectNewsError, selectNewsStatus } from '@/redux/slices/news';
import { selectPosts } from '@/redux/slices/posts';
import { selectVideos } from '@/redux/slices/videos';
import { STATUS } from '@/redux/status';
import { PostSkeleton } from '@/components/blog/Post/PostSkeleton';
import styles from './BlogAside.module.scss';

export const BlogAside = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const news = useSelector(selectNews);
  const newsStatus = useSelector(selectNewsStatus);
  const newsError = useSelector(selectNewsError);
  const postsCount = useSelector(selectPosts).length;
  const videosCount = useSelector(selectVideos).length;

  const isNewsLoading = newsStatus === STATUS.LOADING;

  useEffect(() => {
    dispatch(getNews());
  }, [dispatch]);

  const showedNews = useMemo(() => {
    if (!news) return [];
    if (location.pathname === '/blog') return news.slice(0, postsCount || 2);
    if (location.pathname === '/video') return news.slice(0, videosCount || 2);
    return [];
  }, [location.pathname, news, postsCount, videosCount]);

  if (newsStatus === STATUS.FAILED) {
    return (
      <aside className={styles.BlogAside}>
        <p className={styles.error}>Failed to load news: {newsError}</p>
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
                {article.content?.length > 120
                  ? `${article.content.substring(0, 120)}...`
                  : article.content || ''}
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
