import { NavLink } from 'react-router-dom';
import styles from './Tab.module.scss';

const sections = [
  {
    gender: 'men',
    title: 'men fashion',
    description: 'Best clothes for men in our boutique',
  },
  {
    gender: 'women',
    title: 'women fashion',
    description: 'Best clothes for women in our boutique',
  },
];

const Tab = ({ panel }) => {
  return (
    <div className={styles.Tab}>
      {sections.map(({ gender, title, description }) => (
        <div className={styles.tabrow} key={gender}>
          <div className={styles.tabitem}>
            <h1>{title}</h1>
            <p>{description}</p>
            <NavLink to="/shop">view more</NavLink>
          </div>
          {panel[gender].map((item, index) => (
            <div className={styles.tabitem} key={index}>
              <img src={item} alt="" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Tab;
