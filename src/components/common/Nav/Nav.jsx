import { NavLink } from 'react-router-dom';
import { links } from '@/utils/data';
import styles from './Nav.module.scss';
import { FaFacebook, FaTwitter, FaTelegram, FaVimeo, FaPinterest } from 'react-icons/fa';

const Nav = () => {
  return (
    <div className={styles.Nav}>
      <nav className={styles.nav}>
        <ul className={styles.social}>
          <li>
            <a href="#">
              <FaFacebook />
            </a>
          </li>
          <li>
            <a href="#">
              <FaTwitter />
            </a>
          </li>
          <li>
            <a href="#">
              <FaTelegram />
            </a>
          </li>
          <li>
            <a href="#">
              <FaVimeo />
            </a>
          </li>
          <li>
            <a href="#">
              <FaPinterest />
            </a>
          </li>
        </ul>
        <ul className={styles.menu}>
          {links.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Nav;
