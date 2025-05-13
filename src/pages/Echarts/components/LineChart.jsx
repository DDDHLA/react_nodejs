import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Card } from 'antd';
import { getLineChartOptions } from '../utils/chartOptions';
import styles from '../index.module.css';

const LineChart = () => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);
    
    const options = getLineChartOptions();
    chartInstance.setOption(options);
    
    const handleResize = () => {
      chartInstance.resize();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      chartInstance.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <Card title="折线图示例">
      <div ref={chartRef} className={styles.chartContainer}></div>
    </Card>
  );
};

export default LineChart;