import React from 'react';
import styles from './Error.module.scss';

const Error = () => {
  return (
    <div className={styles.Error}>
      <h1>Something Wrong With This...</h1>
      <p>Let`s watch a video while our specialists are working</p>
        <video  controls className={styles.video}>
          <source src="/helios.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
    </div>
  );
};

export default Error;
