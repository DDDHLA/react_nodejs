import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import styles from './PieChart.module.less';

const PieChart = ({ data = [] }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

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

    const colors = [
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#83bff6' },
        { offset: 0.5, color: '#188df0' },
        { offset: 1, color: '#188df0' }
      ]),
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#25f3e6' },
        { offset: 0.5, color: '#4adbb7' },
        { offset: 1, color: '#5ccce4' }
      ]),
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#ffd04b' },
        { offset: 0.5, color: '#ff9a29' },
        { offset: 1, color: '#ff8c37' }
      ]),
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#df76ff' },
        { offset: 0.5, color: '#bd43ff' },
        { offset: 1, color: '#a937f0' }
      ]),
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#ff6e7e' },
        { offset: 0.5, color: '#ff3656' },
        { offset: 1, color: '#ff1343' }
      ])
    ];

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      color: colors,
      series: [
        {
          name: '比例分布',
          type: 'pie',
          radius: '65%',
          center: ['50%', '55%'],
          roseType: 'radius',
          labelLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            },
            smooth: 0.2,
            length: 10,
            length2: 20
          },
          itemStyle: {
            borderRadius: 8
          },
          label: {
            color: '#fff'
          },
          data: data.map((item, index) => ({
            value: item.value,
            name: item.name
          }))
        }
      ]
    };

    chartInstance.current.setOption(option);
  };

  return <div ref={chartRef} className={styles.chartContainer}></div>;
};

export default PieChart; 