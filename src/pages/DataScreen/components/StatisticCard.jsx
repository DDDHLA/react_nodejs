import React from "react";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import styles from "./StatisticCard.module.less";

const StatisticCard = ({ title, value, prefix = "", increase, color }) => {
  return (
    <div className={styles.statisticCard}>
      <div className={styles.cardTitle}>{title}</div>
      <div className={styles.cardValue} style={{ color }}>
        {prefix}
        {value}
      </div>
      <div className={styles.cardFooter}>
        <span
          className={styles.increaseValue}
          style={{ color: increase >= 0 ? "#52c41a" : "#ff4d4f" }}
        >
          {increase >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {Math.abs(increase)}%
        </span>
        <span className={styles.compareText}>同比上周</span>
      </div>
    </div>
  );
};

export default StatisticCard;
