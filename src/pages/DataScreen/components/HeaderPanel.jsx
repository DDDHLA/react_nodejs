import React from 'react';
import styles from './HeaderPanel.module.less';

const HeaderPanel = ({ title }) => {
  const currentTime = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return (
    <div className={styles.headerPanel}>
      <div className={styles.leftDecoration}></div>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.rightDecoration}></div>
      <div className={styles.timeDisplay}>{currentTime}</div>
    </div>
  );
};

export default HeaderPanel;