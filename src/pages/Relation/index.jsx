import { useEffect, useRef } from "react";
import * as echarts from "echarts";

function RelationChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const categories = [
      { name: "公司" }, // category 0
      { name: "董事/法人/参股" }, // category 1
    ];

    const option = {
      title: {
        text: "知识图谱示例",
      },
      tooltip: {}, // 默认的 tooltip
      legend: [
        {
          // 图例组件
          data: categories.map(function (a) {
            return a.name;
          }),
        },
      ],
      series: [
        {
          name: "关系图",
          type: "graph",
          layout: "force", // 使用力引导布局
          data: [
            // 节点数据
            {
              id: "0",
              name: "浏览器有限公司",
              category: 0,
              symbolSize: 80, // 稍微增大节点以便容纳文字
              draggable: true,
            },
            {
              id: "1",
              name: "HTML科技",
              category: 0,
              symbolSize: 70, // 稍微增大节点以便容纳文字
              draggable: true,
            },
            {
              id: "2",
              name: "CSS科技",
              category: 0,
              symbolSize: 70, // 稍微增大节点以便容纳文字
              draggable: true,
            },
            {
              id: "3",
              name: "JavaScript科技",
              category: 0,
              symbolSize: 70, // 稍微增大节点以便容纳文字
              draggable: true,
            },
            {
              id: "4",
              name: "操作系统集团",
              category: 0,
              symbolSize: 70, // 稍微增大节点以便容纳文字
              draggable: true,
            },
            {
              id: "5",
              name: "Chrome",
              category: 1,
              symbolSize: 50, // 稍微增大节点以便容纳文字
              draggable: true,
            },
            {
              id: "6",
              name: "Firefox",
              category: 1,
              symbolSize: 50, // 稍微增大节点以便容纳文字
              draggable: true,
            },
            {
              id: "7",
              name: "Safari",
              category: 1,
              symbolSize: 50, // 稍微增大节点以便容纳文字
              draggable: true,
            },
            {
              id: "8",
              name: "IE",
              category: 1,
              symbolSize: 50, // 稍微增大节点以便容纳文字
              draggable: true,
            },
          ],
          links: [
            // 边数据
            { source: "1", target: "0", name: "参股" },
            { source: "2", target: "0", name: "参股" },
            { source: "3", target: "0", name: "参股" },
            { source: "4", target: "0", name: "参股" },
            { source: "5", target: "0", name: "董事" },
            { source: "5", target: "3", name: "法人" }, // Chrome 是 JS科技 的法人
            { source: "6", target: "0", name: "董事" },
            { source: "7", target: "0", name: "董事" },
            { source: "8", target: "0", name: "董事" },
          ],
          categories: categories, // 节点分类
          roam: true, // 开启缩放和拖动
          label: {
            // 节点标签
            show: true,
            position: "inside", // 将标签放在节点内部
            formatter: "{b}", // 显示节点名称
            color: "#fff", // 设置标签颜色为白色以便在深色节点上可见
            fontSize: 10, // 可以调整字体大小
          },
          edgeSymbol: ["", "arrow"],
          edgeSymbolSize: [80, 10],
          lineStyle: {
            // 边的统一样式
            color: "source", // 边的颜色跟随源节点
            curveness: 0, // 边的曲度
            width: 2, // 可以调整边的宽度
            opacity: 0.7, // 可以调整边的透明度
            // edgeSymbol: ["none", "arrow"], // 在目标节点处显示箭头
            // edgeSymbolSize: [4, 10], // 设置终点箭头尺寸 // 设置箭头的大小 [起点箭头大小, 终点箭头大小]
          },
          edgeLabel: {
            // 边标签
            show: true,
            formatter: function (params) {
              return params.data.name; // 显示边的名称
            },
            fontSize: 10,
            color: "#333", // 设置边标签颜色
          },
          force: {
            // 力引导布局配置
            repulsion: 150, // 增大斥力，避免节点重叠
            edgeLength: [120, 180], // 适当增加边长
            gravity: 0, // 可以调整引力，影响布局紧凑度
          },
          emphasis: {
            // 高亮状态配置
            focus: "adjacency", // 鼠标悬浮高亮邻接节点和边
            label: {
              // 高亮时节点标签样式
              show: true, // 确保高亮时标签可见
            },
            lineStyle: {
              width: 4, // 高亮时边的宽度
              opacity: 1, // 高亮时边不透明
            },
          },
        },
      ],
    };

    chartInstance.setOption(option);

    // 调整图表大小
    const resizeHandler = () => {
      chartInstance.resize();
    };
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      chartInstance.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "600px" }}></div>;
}

export default RelationChart;
