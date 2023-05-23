import styles from './Footer.module.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className={styles.Footer}>
      <p>Copyright &copy; {currentYear} byCold</p>
    </div>
  );
};

export default Footer;
