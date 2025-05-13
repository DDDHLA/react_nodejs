// 柱状图配置
export const getBarChartOptions = () => {
  return {
    title: {
      text: '柱状图示例'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '销售额',
        type: 'bar',
        data: [120, 200, 150, 80, 70, 110, 130]
      }
    ]
  };
};

// 折线图配置
export const getLineChartOptions = () => {
  return {
    title: {
      text: '折线图示例'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '访问量',
        type: 'line',
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        smooth: true
      }
    ]
  };
};

// 饼图配置
export const getPieChartOptions = () => {
  return {
    title: {
      text: '饼图示例',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [
          { value: 335, name: '直接访问' },
          { value: 310, name: '邮件营销' },
          { value: 234, name: '联盟广告' },
          { value: 135, name: '视频广告' },
          { value: 1548, name: '搜索引擎' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
};

// 地图配置
export const getMapChartOptions = () => {
  return {
    title: {
      text: '中国地图示例',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}'
    },
    visualMap: {
      min: 0,
      max: 2000,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'],
      calculable: true
    },
    series: [
      {
        name: '数据',
        type: 'map',
        map: 'china',
        roam: true,
        label: {
          show: true
        },
        data: [
          { name: '北京', value: 1500 },
          { name: '上海', value: 1800 },
          { name: '广东', value: 1200 },
          { name: '四川', value: 900 },
          { name: '浙江', value: 1100 },
          { name: '江苏', value: 1300 },
          { name: '山东', value: 800 }
        ]
      }
    ]
  };
};