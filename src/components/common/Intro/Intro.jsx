import Nav from '../Nav/Nav';
import styles from './Intro.module.scss';
import { Box, Typography } from '@mui/material';

const Intro = () => {
  return (
    <Box>
      <div className={styles.header}>
        <div className={styles.left}>
          <Typography variant="h1" className={styles.title}>
            <span>Golden</span> exits
          </Typography>
        </div>
        <div className={styles.right}></div>
      </div>
      <div className={styles.nav}>
        <Nav />
      </div>
    </Box>
  );
};

export default Intro;