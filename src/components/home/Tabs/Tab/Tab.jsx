import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Tab.module.scss';

const Tab = ({ panel }) => {
  return (
    <div className={styles.Tab}>
      <div className={styles.tabrow}>
        <div className={styles.tabitem}>
          <h1>men fashion</h1>
          <p>Best clothes for men in our boutique</p>
          <NavLink to="/shop">
            <button>view more</button>
          </NavLink>
        </div>
        {panel.men.map((item, index) => (
          <div className={styles.tabitem} key={index}>
            <img src={item} alt="" />
          </div>
        ))}
      </div>
      <div className={styles.tabrow}>
        <div className={styles.tabitem}>
          <h1>women fashion</h1>
          <p>Best clothes for women in our boutique</p>
          <NavLink to="/shop">
            <button>view more</button>
          </NavLink>
        </div>
        {panel.women.map((item, index) => (
          <div className={styles.tabitem} key={index}>
            <img src={item} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tab;
