import React, { useEffect, useRef } from 'react';
import { Canvas, Chart, Line, Axis, Tooltip } from '@antv/f2';

interface DataPoint {
  date: string;
  value: number;
}

const LineChart: React.FC = () => {
  const containerRef = useRef<HTMLCanvasElement>(null);
  
  const data: DataPoint[] = [
    { date: '2025-01', value: 7200 },
    { date: '2025-02', value: 7800 },
    { date: '2025-03', value: 8200 },
    { date: '2025-04', value: 7900 },
    { date: '2025-05', value: 8400 },
    { date: '2025-06', value: 8631.1 },
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    
    const context = containerRef.current.getContext('2d');
    if (!context) return;
    
    // 动态计算Y轴范围
    const values = data.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    
    // 方案1：百分比留白（推荐）
    const padding = (maxValue - minValue) * 0.1; // 上下各留10%的空白
    const yMin = Math.floor(minValue - padding);
    const yMax = Math.ceil(maxValue + padding);
    
    // 方案2：固定值留白
    // const yMin = Math.floor(minValue - 200);
    // const yMax = Math.ceil(maxValue + 200);
    
    // 方案3：nice值（取整到更美观的数字）
    // const yMin = Math.floor(minValue / 100) * 100 - 100;
    // const yMax = Math.ceil(maxValue / 100) * 100 + 100;
    
    // 创建图表配置
    const LineChartElement = {
      type: Canvas,
      props: {
        context,
        pixelRatio: window.devicePixelRatio,
        children: {
          type: Chart,
          props: {
            data,
            children: [
              {
                type: Axis,
                props: {
                  field: 'date',
                  tickCount: 6,
                  style: {
                    label: { align: 'between' },
                  },
                  grid: null  // 隐藏X轴网格线
                }
              },
              {
                type: Axis,
                props: {
                  field: 'value',
                  tickCount: 5,
                  min: yMin,  // 动态计算的最小值
                  max: yMax,  // 动态计算的最大值
                  grid: null  // 隐藏Y轴网格线
                }
              },
              {
                type: Line,
                props: {
                  x: 'date',
                  y: 'value'
                }
              },
              {
                type: Tooltip,
                props: {
                  showCrosshairs: true,
                  showTitle: true,
                  showTooltipMarker: true,
                  snap: true,
                  crosshairsType: 'xy',
                  crosshairsStyle: {
                    lineDash: [2],
                    stroke: '#999'
                  }
                }
              }
            ]
          }
        }
      }
    };

    // 创建并渲染图表
    const chart = new Canvas(LineChartElement.props as any);
    chart.render();
  }, []);

  return (
    <div>
      <canvas ref={containerRef} id="container" width={600} height={400} />
    </div>
  );
};

export default LineChart;
