import { useState } from 'react';
import { Link } from 'react-router-dom';
import Tab from './Tab/Tab';
import { tabspanels } from '@/utils/data';
import styles from './Tabs.module.scss';

const tabs = ['shoes', 'shirts', 'jeans', 'accessories'];

const Tabs = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleIndex = index => {
    setTabIndex(index);
  };

  return (
    <div className={styles.Tabs}>
      <div className={styles.title}>
        <h1>Our Products</h1>
        <Link to="/shop">View all products</Link>
      </div>
      <div className={styles.tabheader}>
        {tabs.map((tab, index) => (
          <button
            onClick={() => handleIndex(index)}
            key={index}
            className={index === tabIndex ? styles.active : ''}
          >
            {tab}
          </button>
        ))}
      </div>
      <Tab panel={tabspanels[tabIndex]} />
    </div>
  );
};

export default Tabs;
