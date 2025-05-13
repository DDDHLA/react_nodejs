// 创建图表实例的通用函数
export const createChartInstance = (element) => {
  if (!element) return null;
  return echarts.init(element);
};

// 处理窗口大小变化的通用函数
export const handleChartResize = (chartInstance) => {
  if (!chartInstance) return;
  chartInstance.resize();
};

// 格式化数据的通用函数
export const formatNumber = (num) => {
  return num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
};

// 生成随机数据的通用函数
export const generateRandomData = (count, min, max) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return data;
};