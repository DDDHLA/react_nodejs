import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import styles from "./CircleChart.module.less";

interface T {
  value: string;
  name: string;
}
interface Obj {
  // data: Array<{ value: number; name: string }>;
  // 转种写法1
  // data: { value: number; name: string }[];
  // 转种写法2
  data: T[];
  type: string;
}
const CircleChart = ({ data = [], type = "pie" }: Obj) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      renderChart();
    }

    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    renderChart();
  }, [data, type]);

  const renderChart = () => {
    if (!chartInstance.current) return;

    const colors = [
      "#4992FF",
      "#7CFFB2",
      "#FDDD60",
      "#FF6E76",
      "#58D9F9",
      "#05C091",
      "#FF8A45",
      "#8d48e3",
      "#dd79ff",
    ];

    const option = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        right: 10,
        top: "center",
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          color: "#fff",
          fontSize: 12,
        },
      },
      series: [
        {
          name: "数据分布",
          type: "pie",
          radius: type === "circle" ? "50%" : ["40%", "70%"],
          center: ["40%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 5,
            borderColor: "rgba(0, 0, 0, 0.1)",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "16",
              fontWeight: "bold",
              color: "#fff",
            },
          },
          labelLine: {
            show: false,
          },
          data: data.map((item, index) => ({
            value: item.value,
            name: item.name,
            itemStyle: {
              color: colors[index % colors.length],
            },
          })),
        },
      ],
    };

    chartInstance.current.setOption(option);
  };

  return <div ref={chartRef} className={styles.chartContainer}></div>;
};

export default CircleChart;
