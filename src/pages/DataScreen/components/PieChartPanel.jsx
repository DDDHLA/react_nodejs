import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import styles from './ChartPanel.module.less';

const PieChartPanel = () => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);
    
    const option = {
      backgroundColor: 'transparent',
      title: {
        text: '产品销售占比',
        textStyle: {
          color: '#fff',
          fontSize: 16
        },
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'center',
        textStyle: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      series: [
        {
          name: '产品销售',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold',
              color: '#fff'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { 
              value: 1048, 
              name: '电子产品',
              itemStyle: { color: '#5470c6' }
            },
            { 
              value: 735, 
              name: '服装',
              itemStyle: { color: '#91cc75' }
            },
            { 
              value: 580, 
              name: '食品',
              itemStyle: { color: '#fac858' }
            },
            { 
              value: 484, 
              name: '家居',
              itemStyle: { color: '#ee6666' }
            },
            { 
              value: 300, 
              name: '其他',
              itemStyle: { color: '#73c0de' }
            }
          ]
        }
      ]
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
    <div className={styles.chartPanel}>
      <div ref={chartRef} className={styles.chartContainer}></div>
    </div>
  );
};

export default PieChartPanel;