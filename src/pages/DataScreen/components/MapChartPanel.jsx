import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import chinaJson from "../../../assets/china.json";
import styles from "./ChartPanel.module.less";

const MapChartPanel = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    // 注册地图数据
    echarts.registerMap("china", chinaJson);

    const chartInstance = echarts.init(chartRef.current);

    const option = {
      backgroundColor: "transparent",
      title: {
        text: "全国销售热力图",
        textStyle: {
          color: "#fff",
          fontSize: 16,
        },
        left: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c}",
      },
      visualMap: {
        min: 0,
        max: 2000,
        left: "5%",
        bottom: "5%",
        text: ["高", "低"],
        textStyle: {
          color: "#fff",
        },
        inRange: {
          color: [
            "#1e90ff",
            "#00ffff",
            "#00ff00",
            "#ffff00",
            "#ff8000",
            "#ff0000",
          ],
        },
        calculable: true,
      },
      series: [
        {
          name: "销售额",
          type: "map",
          map: "china",
          roam: true,
          emphasis: {
            label: {
              show: true,
            },
          },
          itemStyle: {
            areaColor: "rgba(20, 41, 87, 0.8)",
            borderColor: "#0692a4",
            borderWidth: 1,
          },
          data: [
            { name: "北京", value: 1500 },
            { name: "上海", value: 1800 },
            { name: "广东", value: 1200 },
            { name: "四川", value: 900 },
            { name: "浙江", value: 1100 },
            { name: "江苏", value: 1300 },
            { name: "山东", value: 800 },
            { name: "河南", value: 700 },
            { name: "湖北", value: 850 },
            { name: "湖南", value: 750 },
            { name: "河北", value: 650 },
            { name: "陕西", value: 600 },
            { name: "福建", value: 950 },
            { name: "辽宁", value: 550 },
            { name: "安徽", value: 500 },
          ],
        },
      ],
    };

    chartInstance.setOption(option);

    const handleResize = () => {
      chartInstance.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      chartInstance.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles.chartPanel}>
      <div ref={chartRef} className={styles.chartContainer}></div>
    </div>
  );
};

export default MapChartPanel;
