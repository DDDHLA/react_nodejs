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
        // 指标
        indicator: [
          { name: "Sales", max: 6500 }, // 销售额
          { name: "Administration", max: 16000 }, // 管理费用
          { name: "Information Technology", max: 30000 }, // 信息技术
          { name: "Customer Support", max: 38000 }, // 客户支持
          { name: "Development", max: 52000 }, // 开发费用
          { name: "Marketing", max: 25000 }, // 市场费用
        ],
      },
      series: [
        {
          // 系列名称
          name: "Budget vs spending", // 预算 vs 支出
          type: "radar", // 雷达图
          data: [
            {
              value: [4200, 3000, 20000, 35000, 50000, 18000], // 数据
              name: "Allocated Budget", // 系列名称
            },
            {
              value: [5000, 14000, 28000, 26000, 42000, 21000], // 数据
              name: "Actual Spending", // 系列名称
            },
          ],
        },
      ],
    };

    chartInstance.setOption(option);

    return () => {
      // 销毁图表实例
      chartInstance.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "700px" }}></div>;
}

export default RadarChart;
