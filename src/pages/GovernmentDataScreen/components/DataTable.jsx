import React, { useState, useEffect } from 'react';
import styles from './DataTable.module.less';

const DataTable = ({ data = [], rowHeight = 36 }) => {
  const [animatedData, setAnimatedData] = useState(data);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    setAnimatedData(data);
  }, [data]);

  useEffect(() => {
    if (animatedData.length <= 4) return;

    const scrollInterval = setInterval(() => {
      setScrolling(true);

      setTimeout(() => {
        setAnimatedData(prev => {
          const newData = [...prev];
          const first = newData.shift();
          newData.push(first);
          return newData;
        });

        setScrolling(false);
      }, 500);
    }, 3000);

    return () => clearInterval(scrollInterval);
  }, [animatedData.length]);

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <div className={styles.titleColumn}>标题</div>
        <div className={styles.dateColumn}>日期</div>
      </div>
      <div className={styles.tableBody}>
        {animatedData.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className={`${styles.tableRow} ${scrolling && index === 0 ? styles.scrollOut : ''}`}
            style={{ height: `${rowHeight}px`, lineHeight: `${rowHeight}px` }}
          >
            <div className={styles.titleColumn} title={item.title}>
              <span className={styles.dot}></span>
              {item.title}
            </div>
            <div className={styles.dateColumn}>{item.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataTable; 