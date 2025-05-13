import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import styles from './index.module.less';
import ChartPanel from '../ChartPanel';

const GaugeChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    // 模拟KPI完成率数据
    const kpiData = [
      { name: '销售额', value: 87.3, target: 100, unit: '万元' },
      { name: '新客户', value: 72.1, target: 100, unit: '个' },
      { name: '客户满意度', value: 93.8, target: 100, unit: '%' }
    ];

    const option = {
      backgroundColor: 'transparent',
      title: {
        text: 'KPI指标完成率',
        textStyle: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 'normal'
        },
        left: 'center',
        top: 5
      },
      tooltip: {
        formatter: '{b}: {c}%'
      },
      series: [
        {
          name: '销售额',
          type: 'gauge',
          center: ['25%', '55%'],
          radius: '80%',
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: 100,
          splitNumber: 10,
          axisLine: {
            lineStyle: {
              width: 8,
              color: [
                [0.3, '#f56c6c'],
                [0.7, '#e6a23c'],
                [1, '#5cb87a']
              ]
            }
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '12%',
            width: 8,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            length: 12,
            lineStyle: {
              color: 'auto',
              width: 2
            }
          },
          splitLine: {
            length: 20,
            lineStyle: {
              color: 'auto',
              width: 3
            }
          },
          axisLabel: {
            color: '#999',
            fontSize: 10,
            distance: -30
          },
          title: {
            offsetCenter: [0, '30%'],
            fontSize: 14,
            color: '#fff',
            fontWeight: 'bold'
          },
          detail: {
            fontSize: 22,
            offsetCenter: [0, '10%'],
            valueAnimation: true,
            formatter: function (value) {
              return value.toFixed(1) + '%';
            },
            color: '#fff'
          },
          data: [{
            value: kpiData[0].value,
            name: kpiData[0].name
          }]
        },
        {
          name: '新客户',
          type: 'gauge',
          center: ['75%', '55%'],
          radius: '80%',
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: 100,
          splitNumber: 10,
          axisLine: {
            lineStyle: {
              width: 8,
              color: [
                [0.3, '#f56c6c'],
                [0.7, '#e6a23c'],
                [1, '#5cb87a']
              ]
            }
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '12%',
            width: 8,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            length: 12,
            lineStyle: {
              color: 'auto',
              width: 2
            }
          },
          splitLine: {
            length: 20,
            lineStyle: {
              color: 'auto',
              width: 3
            }
          },
          axisLabel: {
            color: '#999',
            fontSize: 10,
            distance: -30
          },
          title: {
            offsetCenter: [0, '30%'],
            fontSize: 14,
            color: '#fff',
            fontWeight: 'bold'
          },
          detail: {
            fontSize: 22,
            offsetCenter: [0, '10%'],
            valueAnimation: true,
            formatter: function (value) {
              return value.toFixed(1) + '%';
            },
            color: '#fff'
          },
          data: [{
            value: kpiData[1].value,
            name: kpiData[1].name
          }]
        },
        {
          name: '客户满意度',
          type: 'gauge',
          center: ['50%', '80%'],
          radius: '60%',
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: 100,
          splitNumber: 10,
          axisLine: {
            lineStyle: {
              width: 8,
              color: [
                [0.3, '#f56c6c'],
                [0.7, '#e6a23c'],
                [1, '#5cb87a']
              ]
            }
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '12%',
            width: 8,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            length: 12,
            lineStyle: {
              color: 'auto',
              width: 2
            }
          },
          splitLine: {
            length: 20,
            lineStyle: {
              color: 'auto',
              width: 3
            }
          },
          axisLabel: {
            color: '#999',
            fontSize: 10,
            distance: -30
          },
          title: {
            offsetCenter: [0, '30%'],
            fontSize: 14,
            color: '#fff',
            fontWeight: 'bold'
          },
          detail: {
            fontSize: 22,
            offsetCenter: [0, '10%'],
            valueAnimation: true,
            formatter: function (value) {
              return value.toFixed(1) + '%';
            },
            color: '#fff'
          },
          data: [{
            value: kpiData[2].value,
            name: kpiData[2].name
          }]
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
    <ChartPanel title="KPI目标完成率">
      <div ref={chartRef} className={styles.chartContainer}></div>
    </ChartPanel>
  );
};

export default GaugeChart; 