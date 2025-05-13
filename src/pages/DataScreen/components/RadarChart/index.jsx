import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import styles from './index.module.less';
import ChartPanel from '../ChartPanel';

const RadarChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    // 模拟数据 - 多个产品在不同维度的评分
    const indicator = [
      { name: '质量', max: 100 },
      { name: '性价比', max: 100 },
      { name: '外观', max: 100 },
      { name: '易用性', max: 100 },
      { name: '创新性', max: 100 },
      { name: '售后服务', max: 100 }
    ];

    const productData = [
      {
        value: [88, 92, 85, 90, 79, 94],
        name: '旗舰产品A'
      },
      {
        value: [82, 95, 75, 85, 90, 80],
        name: '中端产品B'
      },
      {
        value: [70, 98, 65, 80, 72, 75],
        name: '入门产品C'
      }
    ];

    const option = {
      backgroundColor: 'transparent',
      color: ['#5470c6', '#91cc75', '#ee6666'],
      title: {
        text: '产品评分对比',
        textStyle: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 'normal'
        },
        left: 'center',
        top: 5
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        bottom: 5,
        data: productData.map(item => item.name),
        textStyle: {
          color: '#fff'
        },
        itemWidth: 15,
        itemHeight: 10
      },
      radar: {
        indicator: indicator,
        shape: 'polygon',
        radius: '60%',
        splitNumber: 5,
        name: {
          textStyle: {
            color: 'rgba(255, 255, 255, 0.9)'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.2)'
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        }
      },
      series: [{
        type: 'radar',
        emphasis: {
          lineStyle: {
            width: 4
          }
        },
        data: productData,
        lineStyle: {
          width: 2
        },
        areaStyle: {
          opacity: 0.2
        }
      }]
    };

    chartInstance.setOption(option);

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
    <ChartPanel title="产品能力评分">
      <div ref={chartRef} className={styles.chartContainer}></div>
    </ChartPanel>
  );
};

export default RadarChart; 