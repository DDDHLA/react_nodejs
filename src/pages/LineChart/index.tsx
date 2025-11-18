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
                  }
                }
              },
              {
                type: Axis,
                props: {
                  field: 'value',
                  tickCount: 5
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
