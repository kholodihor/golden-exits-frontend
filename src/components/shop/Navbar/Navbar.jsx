import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BiSearch } from 'react-icons/bi';
import { BsCart2 } from 'react-icons/bs';
import { selectCartItems } from '@/redux/slices/cart';
import styles from './Navbar.module.scss';

const Navbar = ({ setQuery }) => {
  // Badge shows the number of distinct products, not total units.
  const quantity = useSelector(selectCartItems).length;

  return (
    <div className={styles.Navbar}>
      {setQuery ? (
        <div className={styles.searchbox}>
          <input
            type="text"
            placeholder="Search by Category"
            className={styles.searchinput}
            onChange={e => setQuery(e.target.value)}
          />
          <BiSearch className={styles.searchicon} />
        </div>
      ) : (
        <div />
      )}
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
