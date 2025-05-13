import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import styles from "./ChartPanel.module.less";

const LineChartPanel = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const option = {
      backgroundColor: "transparent",
      title: {
        text: "近30天销售趋势",
        textStyle: {
          color: "#fff",
          fontSize: 16,
        },
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
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
        boundaryGap: false,
        data: Array.from({ length: 30 }, (_, i) => `${i + 1}日`),
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
          type: "line",
          stack: "总量",
          // areaStyle表示折线图的填充颜色
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(0, 136, 212, 0.8)",
              },
              {
                offset: 1,
                // color: 'rgba(0, 136, 212, 0.1)'
                color: "red",
              },
            ]),
          },
          emphasis: {
            focus: "series",
          },
          lineStyle: {
            width: 2,
            color: "#00a0e9",
          },
          symbol: "circle",
          symbolSize: 8,
          itemStyle: {
            color: "#00a0e9",
            borderColor: "#fff",
            borderWidth: 2,
          },
          data: [
            12000, 13200, 10100, 13400, 19000, 23400, 21200, 19300, 17300,
            16200, 14100, 13200, 12500, 12000, 11000, 10200, 9600, 9200, 10000,
            10500, 11500, 15000, 19000, 21000, 18000, 14000, 13000, 11000, 9500,
            8500,
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

export default LineChartPanel;
