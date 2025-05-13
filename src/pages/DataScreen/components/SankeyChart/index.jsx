import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import styles from './index.module.less';
import ChartPanel from '../ChartPanel';

const SankeyChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    // 模拟用户流量来源和流向的数据
    const data = {
      nodes: [
        // 流量来源
        { name: '搜索引擎' },
        { name: '直接访问' },
        { name: '社交媒体' },
        { name: '外部链接' },
        { name: '电子邮件' },
        // 页面流向
        { name: '首页' },
        { name: '产品列表' },
        { name: '产品详情' },
        { name: '购物车' },
        { name: '下单页面' },
        { name: '支付页面' },
        // 结果
        { name: '完成购买' },
        { name: '放弃购买' }
      ],
      links: [
        // 从来源到首页
        { source: '搜索引擎', target: '首页', value: 3500 },
        { source: '直接访问', target: '首页', value: 2000 },
        { source: '社交媒体', target: '首页', value: 1800 },
        { source: '外部链接', target: '首页', value: 1200 },
        { source: '电子邮件', target: '首页', value: 900 },

        // 从来源到产品列表
        { source: '搜索引擎', target: '产品列表', value: 1500 },
        { source: '社交媒体', target: '产品列表', value: 800 },
        { source: '外部链接', target: '产品列表', value: 600 },

        // 首页流向
        { source: '首页', target: '产品列表', value: 5200 },
        { source: '首页', target: '放弃购买', value: 3200 },

        // 产品列表流向
        { source: '产品列表', target: '产品详情', value: 4800 },
        { source: '产品列表', target: '放弃购买', value: 3300 },

        // 产品详情流向
        { source: '产品详情', target: '购物车', value: 2800 },
        { source: '产品详情', target: '放弃购买', value: 4100 },

        // 购物车流向
        { source: '购物车', target: '下单页面', value: 2200 },
        { source: '购物车', target: '放弃购买', value: 600 },

        // 下单页面流向
        { source: '下单页面', target: '支付页面', value: 1900 },
        { source: '下单页面', target: '放弃购买', value: 300 },

        // 支付流向
        { source: '支付页面', target: '完成购买', value: 1500 },
        { source: '支付页面', target: '放弃购买', value: 400 }
      ]
    };

    const option = {
      backgroundColor: 'transparent',
      title: {
        text: '用户流量转化路径分析',
        textStyle: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 'normal'
        },
        left: 'center',
        top: 5
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        formatter: function (params) {
          return '${params.data.source} -> ${params.data.target}: ${params.data.value}';
        }
      },
      series: [{
        type: 'sankey',
        data: data.nodes,
        links: data.links,
        left: '5%',
        right: '5%',
        top: '12%',
        bottom: '5%',
        focusNodeAdjacency: 'allEdges',
        nodeWidth: 20,
        nodeGap: 8,
        layoutIterations: 32,
        label: {
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: 12,
          position: 'right'
        },
        itemStyle: {
          borderWidth: 1,
          borderColor: '#aaa'
        },
        lineStyle: {
          color: 'source',
          opacity: 0.4,
          curveness: 0.5
        },
        emphasis: {
          lineStyle: {
            opacity: 0.6
          },
          itemStyle: {
            borderWidth: 0
          }
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
    <ChartPanel title="用户流量转化漏斗">
      <div ref={chartRef} className={styles.chartContainer}></div>
    </ChartPanel>
  );
};

export default SankeyChart; 