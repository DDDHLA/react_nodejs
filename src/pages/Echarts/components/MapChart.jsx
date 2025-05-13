import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Card } from 'antd';
import { getMapChartOptions } from '../utils/chartOptions';
import styles from '../index.module.css';
import chinaJson from '../../../assets/china.json';

const MapChart = () => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    // 注册地图数据
    echarts.registerMap('china', chinaJson);
    
    const chartInstance = echarts.init(chartRef.current);
    
    const options = getMapChartOptions();
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
    <Card title="中国地图示例">
      <div ref={chartRef} className={styles.chartContainer}></div>
    </Card>
  );
};

export default MapChart;