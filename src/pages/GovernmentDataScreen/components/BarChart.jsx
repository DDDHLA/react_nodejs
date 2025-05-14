import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import styles from './BarChart.module.less';

const BarChart = ({ data = [], horizontal = false, color = '#36a8fe', multiColor = false }) => {
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
  }, [data, horizontal, color, multiColor]);

  const renderChart = () => {
    if (!chartInstance.current) return;

    const names = data.map(item => item.name);
    const values = data.map(item => item.value);

    // 多色渐变定义
    const colorList = [
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#36A8FE' },
        { offset: 1, color: '#157EFB' }
      ]),
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#4EBBFF' },
        { offset: 1, color: '#6149F6' }
      ]),
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#7EE6F8' },
        { offset: 1, color: '#21B7D9' }
      ]),
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#FFBA69' },
        { offset: 1, color: '#FF7A4C' }
      ]),
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#FFD66C' },
        { offset: 1, color: '#FFAF3C' }
      ])
    ];

    // 创建主色渐变
    const mainColor = typeof color === 'string'
      ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: color },
        { offset: 1, color: echarts.color.lift(color, -0.2) }
      ])
      : color;

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        top: '10%',
        left: horizontal ? '15%' : '5%',
        right: '5%',
        bottom: horizontal ? '5%' : '15%',
        containLabel: true
      },
      [horizontal ? 'yAxis' : 'xAxis']: {
        type: 'category',
        data: names,
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        },
        axisLabel: {
          color: '#fff',
          margin: horizontal ? 10 : 20,
          interval: 0
        },
        axisTick: {
          show: false
        }
      },
      [horizontal ? 'xAxis' : 'yAxis']: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisLabel: {
          color: '#fff'
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      },
      series: [
        {
          type: 'bar',
          data: values.map((value, index) => {
            return {
              value,
              itemStyle: {
                color: multiColor ? colorList[index % colorList.length] : mainColor,
                borderRadius: [4, 4, 4, 4]
              }
            };
          }),
          barWidth: horizontal ? 15 : '40%',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(255, 255, 255, 0.05)',
            borderRadius: [4, 4, 4, 4]
          }
        }
      ]
    };

    chartInstance.current.setOption(option);
  };

  return <div ref={chartRef} className={styles.chartContainer}></div>;
};

export default BarChart; 