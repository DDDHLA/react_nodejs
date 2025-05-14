import React from 'react';
import { Decoration3 } from '@jiaminghi/data-view-react';
import styles from './HeaderTitle.module.less';

const HeaderTitle = ({ title = '政务服务大数据可视化监管平台' }) => {
  return (
    <div className={styles.headerTitle}>
      <Decoration3 className={styles.leftDecoration} />
      <div className={styles.title}>{title}</div>
      <Decoration3 className={styles.rightDecoration} />
    </div>
  );
};

export default HeaderTitle; 