import React from 'react';
import styles from './NumberStatistic.module.less';

const NumberStatistic = ({ value = '0', unit = '', desc = '' }) => {
  return (
    <div className={styles.numberContainer}>
      <div className={styles.number}>{value}</div>
      {unit && <div className={styles.unit}>{unit}</div>}
      {desc && <div className={styles.desc}>{desc}</div>}
    </div>
  );
};

export default NumberStatistic; 