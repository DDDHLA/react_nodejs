import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
// 1. 移除旧的 import 'echarts/map/js/china.js';
// 2. 导入你下载的 china.json 文件
import chinaJson from '@/assets/china.json'; // 假设你将文件放在 src/assets/china.json

function InfoMapChart() {
  const chartRef = useRef(null);

  // 省份或主要城市的经纬度数据（示例）
  const geoCoordMap = {
    '北京': [116.4074, 39.9042],
    '上海': [121.4737, 31.2304],
    '广州': [113.2644, 23.1291],
    '新疆': [87.6277, 43.793],
    '西藏': [91.1172, 29.6469],
    '内蒙古': [111.6708, 40.8183],
    '天津': [117.201, 39.1334],
    '河北': [114.5149, 38.0428],
    '山西': [112.5489, 37.8706],
    '辽宁': [123.4315, 41.8057],
    '吉林': [125.3235, 43.817],
    '黑龙江': [126.6424, 45.7569],
    '江苏': [118.7969, 32.0603],
    '浙江': [120.1551, 30.2741],
    '安徽': [117.283, 31.8611],
    '福建': [119.3062, 26.0753],
    '江西': [115.8579, 28.6832],
    '山东': [117.0204, 36.6753],
    '河南': [113.6254, 34.7466],
    '湖北': [114.3055, 30.5928],
    '湖南': [112.9838, 28.1941],
    '广东': [113.2644, 23.1291], // 重复广州作为代表
    '广西': [108.366, 22.817],
    '海南': [110.3492, 20.0173],
    '重庆': [106.5516, 29.563],
    '四川': [104.0758, 30.6517],
    '贵州': [106.7135, 26.5783],
    '云南': [102.7123, 25.0406],
    '陕西': [108.9542, 34.2655],
    '甘肃': [103.8343, 36.0611],
    '青海': [101.7782, 36.6171],
    '宁夏': [106.2782, 38.4664],
  };

  // 转换数据格式以适应 ECharts lines series
  const convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var dataItem = data[i];
      var fromCoord = geoCoordMap[dataItem[0].name];
      var toCoord = geoCoordMap[dataItem[1].name];
      if (fromCoord && toCoord) {
        res.push({
          fromName: dataItem[0].name,
          toName: dataItem[1].name,
          coords: [fromCoord, toCoord]
        });
      }
    }
    return res;
  };

  // 定义数据流向（示例：从北京出发）
  const BJData = [
    [{name: '北京'}, {name: '上海'}],
    [{name: '北京'}, {name: '广州'}],
    [{name: '北京'}, {name: '新疆'}],
    [{name: '北京'}, {name: '西藏'}],
    [{name: '北京'}, {name: '内蒙古'}],
    [{name: '北京'}, {name: '天津'}],
    [{name: '北京'}, {name: '河北'}],
    [{name: '北京'}, {name: '山西'}],
    [{name: '北京'}, {name: '辽宁'}],
    [{name: '北京'}, {name: '吉林'}],
    [{name: '北京'}, {name: '黑龙江'}],
    [{name: '北京'}, {name: '江苏'}],
    [{name: '北京'}, {name: '浙江'}],
    [{name: '北京'}, {name: '安徽'}],
    [{name: '北京'}, {name: '福建'}],
    [{name: '北京'}, {name: '江西'}],
    [{name: '北京'}, {name: '山东'}],
    [{name: '北京'}, {name: '河南'}],
    [{name: '北京'}, {name: '湖北'}],
    [{name: '北京'}, {name: '湖南'}],
    [{name: '北京'}, {name: '广西'}],
    [{name: '北京'}, {name: '海南'}],
    [{name: '北京'}, {name: '重庆'}],
    [{name: '北京'}, {name: '四川'}],
    [{name: '北京'}, {name: '贵州'}],
    [{name: '北京'}, {name: '云南'}],
    [{name: '北京'}, {name: '陕西'}],
    [{name: '北京'}, {name: '甘肃'}],
    [{name: '北京'}, {name: '青海'}],
    [{name: '北京'}, {name: '宁夏'}],
  ];

  useEffect(() => {
    // 3. 在初始化 ECharts 实例之前注册地图
    echarts.registerMap('china', chinaJson);

    const chartInstance = echarts.init(chartRef.current);

    const option = {
      backgroundColor: '#0F375F', // 设置背景色类似示例
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          if (params.seriesType === 'lines') {
            return params.data.fromName + ' -> ' + params.data.toName;
          } else {
            return params.name;
          }
        }
      },
      geo: {
        map: 'china', // 确保这里使用的是注册的地图名称 'china'
        roam: true, // 开启缩放和平移
        label: {
          emphasis: {
            show: false // 鼠标悬浮时不显示省份标签
          }
        },
        itemStyle: {
          normal: {
            areaColor: '#323C48', // 地图区域颜色
            borderColor: '#111' // 边界线颜色
          },
          emphasis: {
            areaColor: '#2B91B7' // 鼠标悬浮时区域颜色
          }
        }
      },
      series: [
        { // 散点图，表示地点
          name: '地点',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: Object.keys(geoCoordMap).map(function (name) {
            return {
              name: name,
              value: geoCoordMap[name].concat([10]), // value 可以用来控制大小或其他属性
              symbol: 'circle', // 使用圆形标记
              symbolSize: 8, // 标记大小
              itemStyle: {
                 color: '#46B2D5' // 标记颜色
              },
              label: {
                formatter: '{b}',
                position: 'right',
                show: true, // 显示地名标签
                color: '#46B2D5', // 标签颜色
                fontSize: 10
              },
              emphasis: { // 高亮样式
                 label: {
                    show: true
                 }
              }
            };
          }),
          zlevel: 2 // 控制层级，确保在地图上层
        },
        { // 中心点（例如北京）的特殊标记
          name: '中心点',
          type: 'effectScatter', // 带涟漪效果的散点图
          coordinateSystem: 'geo',
          data: [{
            name: '北京',
            value: geoCoordMap['北京'].concat([20]), // 可以设置不同的大小或值
            symbolSize: 15,
            itemStyle: {
              color: '#FF4500' // 突出显示中心点颜色
            },
            label: { // 中心点标签样式
                formatter: '{b}',
                position: 'right',
                show: true,
                color: '#FF4500',
                fontSize: 12,
                fontWeight: 'bold'
            },
          }],
          rippleEffect: { // 涟漪特效配置
            brushType: 'stroke'
          },
          zlevel: 3 // 最高层级
        },
        { // 动态流向线
          name: '信息流',
          type: 'lines',
          coordinateSystem: 'geo',
          zlevel: 2, // 线条层级
          effect: {
            show: true,
            period: 4, // 动画周期，越小越快
            trailLength: 0.1, // 拖尾长度
            symbol: 'arrow', // 箭头图标
            symbolSize: 6 // 箭头大小
          },
          lineStyle: {
            normal: {
              color: '#46B2D5', // 线条颜色
              width: 1, // 线条宽度
              opacity: 0.6, // 线条透明度
              curveness: 0.2 // 线条曲度
            }
          },
          data: convertData(BJData) // 使用处理后的数据
        }
      ]
    };

    chartInstance.setOption(option);

    // 调整图表大小
    const resizeHandler = () => {
      chartInstance.resize();
    };
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      chartInstance.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>; // 增加高度以便更好显示
}

export default InfoMapChart;