import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import styles from './RadarChart.module.less';

const RadarChart = ({ data = [] }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const defaultData = [
    { name: '指标一', max: 100, value: 85 },
    { name: '指标二', max: 100, value: 70 },
    { name: '指标三', max: 100, value: 60 },
    { name: '指标四', max: 100, value: 90 },
    { name: '指标五', max: 100, value: 75 }
  ];

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      renderChart();
    }

    const handleResize = () => {
      chartInstance.current && chartInstance.current.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current && chartInstance.current.dispose();
    };
  }, []);

  useEffect(() => {
    renderChart();
  }, [data]);

  const renderChart = () => {
    if (!chartInstance.current) return;

    const finalData = data.length > 0 ? data : defaultData;
    const indicator = finalData.map(item => ({
      name: item.name,
      max: item.max || 100
    }));

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item'
      },
      radar: {
        indicator: indicator,
        splitNumber: 4,
        axisName: {
          color: '#fff',
          fontSize: 12
        },
        splitLine: {
          lineStyle: {
            color: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.2)',
              'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.4)']
          }
        },
        splitArea: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.5)'
          }
        }
      },
      series: [
        {
          name: '数据分析',
          type: 'radar',
          data: [
            {
              value: finalData.map(item => item.value),
              name: '当前数据',
              areaStyle: {
                color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                  {
                    offset: 0,
                    color: 'rgba(54, 168, 254, 0.8)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(54, 168, 254, 0)'
                  }
                ])
              },
              lineStyle: {
                width: 2,
                color: '#36A8FE'
              },
              symbol: 'circle',
              symbolSize: 6
            }
          ]
        }
      ]
    };

    chartInstance.current.setOption(option);
  };

  return <div ref={chartRef} className={styles.chartContainer}></div>;
};

export default RadarChart; 