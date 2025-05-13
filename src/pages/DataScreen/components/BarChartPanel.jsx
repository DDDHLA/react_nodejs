import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import styles from "./ChartPanel.module.less";

const BarChartPanel = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const option = {
      backgroundColor: "transparent",
      title: {
        text: "各区域销售占比",
        textStyle: {
          color: "#fff",
          fontSize: 16,
        },
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: ["华东", "华南", "华北", "西南", "东北", "西北", "华中"],
        axisLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.3)",
          },
        },
        axisLabel: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.3)",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
        axisLabel: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
      series: [
        {
          name: "销售额",
          type: "bar",
          barWidth: "60%",
          data: [
            {
              value: 5200,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#83bff6" },
                  { offset: 0.5, color: "#188df0" },
                  { offset: 1, color: "#188df0" },
                ]),
              },
            },
            {
              value: 4500,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#25f3e6" },
                  { offset: 0.5, color: "#4fd6d2" },
                  { offset: 1, color: "#41d4cf" },
                ]),
              },
            },
            {
              value: 3700,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#44fab8" },
                  { offset: 0.5, color: "#44fab8" },
                  { offset: 1, color: "#33d0a1" },
                ]),
              },
            },
            {
              value: 3100,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#fccb05" },
                  { offset: 0.5, color: "#f5a70d" },
                  { offset: 1, color: "#f28e2c" },
                ]),
              },
            },
            {
              value: 2800,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#ff8a70" },
                  { offset: 0.5, color: "#ff7a45" },
                  { offset: 1, color: "#ff5722" },
                ]),
              },
            },
            {
              value: 2300,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#ff9a9e" },
                  { offset: 0.5, color: "#ff7875" },
                  { offset: 1, color: "#ff5252" },
                ]),
              },
            },
            {
              value: 1900,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#a18cd1" },
                  { offset: 0.5, color: "#9a85d3" },
                  { offset: 1, color: "#8f74d8" },
                ]),
              },
            },
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

export default BarChartPanel;
