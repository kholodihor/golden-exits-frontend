import { Container } from '@mui/material';
import { Link } from 'react-router-dom';
import pt1 from '@/assets/img/arrivals/product-type-1.jpg';
import pt2 from '@/assets/img/arrivals/product-type-2.jpg';
import pt3 from '@/assets/img/arrivals/product-type-3.jpg';
import pt4 from '@/assets/img/arrivals/product-type-4.jpg';
import styles from './AboutGE.module.scss';

const images = [
  { src: pt1, alt: 'shirt' },
  { src: pt2, alt: 'shoes' },
  { src: pt3, alt: 'jeans' },
  { src: pt4, alt: 'hoodie' },
];

const AboutGE = () => {
  return (
    <section className={styles.AboutGE}>
      <div className={styles.title}>
        <h1>
          About <span>Golden Exits</span>{' '}
        </h1>
        <Link to="/blog">Read the History</Link>
      </div>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <div className={styles.grid}>
            {images.map(({ src, alt }) => (
              <img src={src} alt={alt} key={alt} />
            ))}
          </div>
          <div className={styles.textbox}>
            <div className={styles.textbox_inner}>
              <h2>Golden Exits is your entrance to the world of gold.</h2>
              <p>
                Welcome to Golden Exits, an exquisite boutique that encapsulates the essence of
                elegance and luxury. Step into a world where sophistication meets contemporary
                style, and allow us to guide you through an unparalleled shopping experience.
                <br /> <br /> At Golden Exits, we curate a meticulously crafted collection of
                fashion and accessories, carefully sourced from renowned designers and emerging
                talents alike. Our boutique showcases an exquisite range of clothing, footwear,
                handbags, and jewelry, each piece handpicked for its impeccable craftsmanship and
                timeless appeal.
              </p>
              <span>
                <br />
                <em>--IN GOLD WE TRUST--</em>
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutGE;
