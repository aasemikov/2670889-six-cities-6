import React from 'react';
import styles from './index.module.css';

const Spinner: React.FC = () => (
  <div className={styles.spinnerContainer} data-testid="spinner">
    <div className={styles.spinner}></div>
    <p className={styles.spinnerText}>Loading...</p>
  </div>
);

export default Spinner;
