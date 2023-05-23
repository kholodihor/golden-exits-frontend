import { useState } from 'react';
import Tab from './Tab/Tab';
import { tabspanels } from '@/utils/data';
import styles from './Tabs.module.scss';

const tabs = ['shoes', 'shirts', 'jeans', 'accesoires'];

const Tabs = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleIndex = (index) => {
    setTabIndex(index);
  };

  return (
    <div className={styles.Tabs}>
      <div className={styles.title}>
        <h1>Our Products</h1>
        <p>View all products</p>
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
