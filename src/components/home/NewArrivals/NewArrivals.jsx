import na1 from '@/assets/img/arrivals/new-arrival-1.jpg';
import na2 from '@/assets/img/arrivals/new-arrival-2.jpg';
import na3 from '@/assets/img/arrivals/new-arrival-3.jpg';
import styles from './NewArrivals.module.scss';

const arrivals = [
  { key: 'summer', src: na1, alt: 'summer collection', word: 'Summer', rest: 'collection' },
  { key: 'quality', src: na2, alt: 'best quality', word: 'best', rest: 'quality' },
  { key: 'autumn', src: na3, alt: 'autumn collection', word: 'Autumn', rest: 'collection' },
];

const NewArrivals = () => {
  return (
    <section className={styles.Arrivals}>
      <div className={styles.images}>
        {arrivals.map(({ key, src, alt, word, rest }) => (
          <div className={styles.image} key={key}>
            <img src={src} alt={alt} />
            <div className={styles.inner_text}>
              <span>{word}</span> {rest}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
