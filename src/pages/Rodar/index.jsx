import { useEffect, useRef } from "react";
import * as echarts from "echarts";

function RadarChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);
    const option = {
      title: {
        text: "Basic Radar Chart",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          const valueIndex = params.dataIndex;
          const indicatorName = params.name;
          const value = params.value[valueIndex];
          return `${params.seriesName}<br/>${indicatorName}: ${value}`;
        },
      },
      legend: {
        data: ["Allocated Budget", "Actual Spending"],
        top: 30, // 图例靠上
      },
      radar: {
        center: ["50%", "50%"], // 往下移动，Y 从 '50%' 改为 '60%'
        radius: "60%", // 可以适当调小雷达图大小
        splitNumber: 5,
        axisName: {
          formatter: function (value, indicator) {
            return `${value}\n(${indicator.max})`;
          },
          textStyle: {
            color: "#000",
            fontSize: 12,
          },
        },
        indicator: [
          { name: "Sales", max: 6500 },
          { name: "Administration", max: 16000 },
          { name: "Information Technology", max: 30000 },
          { name: "Customer Support", max: 38000 },
          { name: "Development", max: 52000 },
          { name: "Marketing", max: 25000 },
        ],
      },
      series: [
        {
          name: "Budget vs spending",
          type: "radar",
          data: [
            {
              value: [4200, 3000, 20000, 35000, 50000, 18000],
              name: "Allocated Budget",
            },
            {
              value: [5000, 14000, 28000, 26000, 42000, 21000],
              name: "Actual Spending",
            },
          ],
        },
      ],
    };

    chartInstance.setOption(option);

    return () => {
      chartInstance.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "700px" }}></div>;
}

export default RadarChart;
