import React from 'react';
import styles from './index.module.less';

const ChartPanel = ({ title, children }) => {
  return (
    <div className={styles.chartPanel}>
      <div className={styles.chartHeader}>
        <div className={styles.chartTitle}>{title}</div>
      </div>
      <div className={styles.chartContent}>
        {children}
      </div>
    </div>
  );
};

export default ChartPanel; 