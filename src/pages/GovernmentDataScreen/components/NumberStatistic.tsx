import styles from "./NumberStatistic.module.less";

const NumberStatistic = ({
  value = "0",
  unit = "",
  desc = "",
}: {
  value: string;
  unit: string;
  desc: string;
}) => {
  return (
    <div className={styles.numberContainer}>
      <div className={styles.number}>{value}</div>
      {unit && <div className={styles.unit}>{unit}</div>}
      {desc && <div className={styles.desc}>{desc}</div>}
    </div>
  );
};

export default NumberStatistic;
