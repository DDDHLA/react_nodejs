import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import styles from './index.module.less';
import ChartPanel from '../ChartPanel';

const HeatmapChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    // 模拟一周内每个小时的访问量数据
    const hours = ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00',
      '7:00', '8:00', '9:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
      '19:00', '20:00', '21:00', '22:00', '23:00'];

    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

    // 生成模拟数据
    const data = [];
    let max = 0;
    for (let i = 0; i < days.length; i++) {
      for (let j = 0; j < hours.length; j++) {
        // 模拟不同时段的访问规律
        let value = 0;

        // 工作日规律
        if (i < 5) {
          // 早高峰 7-9点
          if (j >= 7 && j <= 9) {
            value = Math.floor(Math.random() * 200) + 300;
          }
          // 工作时间 9-18点
          else if (j > 9 && j < 18) {
            value = Math.floor(Math.random() * 100) + 200;
          }
          // 晚高峰 18-21点
          else if (j >= 18 && j <= 21) {
            value = Math.floor(Math.random() * 150) + 250;
          }
          // 夜间 22-6点
          else {
            value = Math.floor(Math.random() * 50) + 10;
          }
        }
        // 周末规律
        else {
          // 上午 10-12点
          if (j >= 10 && j <= 12) {
            value = Math.floor(Math.random() * 100) + 250;
          }
          // 下午 14-20点
          else if (j >= 14 && j <= 20) {
            value = Math.floor(Math.random() * 150) + 300;
          }
          // 其他时间
          else {
            value = Math.floor(Math.random() * 100) + 50;
          }
        }

        // 确保数据有一定随机性
        value += Math.floor(Math.random() * 50);

        data.push([j, i, value]);
        max = Math.max(max, value);
      }
    }

    const option = {
      backgroundColor: 'transparent',
      title: {
        text: '一周网站访问量热力图',
        textStyle: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 'normal'
        },
        left: 'center',
        top: 5
      },
      tooltip: {
        position: 'top',
        formatter: function (params) {
          return '${days[params.value[1]]} ${hours[params.value[0]]}<br />访问量: ${params.value[2]}';
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: hours,
        axisTick: {
          alignWithLabel: true,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: 10,
          interval: 3 // 间隔显示
        }
      },
      yAxis: {
        type: 'category',
        data: days,
        axisTick: {
          alignWithLabel: true,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: 12
        }
      },
      visualMap: {
        min: 0,
        max: max,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '0%',
        textStyle: {
          color: 'rgba(255, 255, 255, 0.7)'
        },
        inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
      },
      series: [{
        name: '访问量',
        type: 'heatmap',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        itemStyle: {
          borderColor: 'rgba(255, 255, 255, 0.05)',
          borderWidth: 1
        },
        label: {
          show: false
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
    <ChartPanel title="网站访问热力分析">
      <div ref={chartRef} className={styles.chartContainer}></div>
    </ChartPanel>
  );
};

export default HeatmapChart; 