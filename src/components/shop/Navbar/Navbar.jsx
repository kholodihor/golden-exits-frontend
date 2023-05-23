import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BiSearch } from 'react-icons/bi';
import { BsCart2 } from 'react-icons/bs';
import styles from './Navbar.module.scss';

const Navbar = ({ setQuery }) => {
  const quantity = useSelector((state) => state.cart.items.length);

  return (
    <div className={styles.Navbar}>
        <div className={styles.searchbox}>
          <input
            type="text"
            placeholder="Search by Category"
            className={styles.searchinput}
            onChange={(e) => setQuery(e.target.value)}
          />
          <BiSearch className={styles.searchicon} />
        </div>
      <div className={styles.cartbox}>
        <Link to="/cart">
          <BsCart2 className={styles.carticon} />
        </Link>
        {quantity > 0 ? <div className={styles.badge}>{quantity}</div> : null}
      </div>
    </div>
  );
};

export default Navbar;
