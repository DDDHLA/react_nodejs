import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

function BarChart() {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
    // 从服务器接收数据
    ws.onmessage = (event) => {
      console.log(event.data);
      setData(JSON.parse(event.data));
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);
    const option = {
      title: { text: "ECharts 入门示例" },
      tooltip: {},
      xAxis: { data: ["t-shirt", "dress", "skirt", "shoes", "pants", "hat"] },
      yAxis: {},
      series: [{ name: "销量", type: "bar", data }],
    };

    chartInstance.setOption(option);

    return () => {
      chartInstance.dispose();
    };
  }, [data]);

  const handleSubmit = (newData) => {
    const ws = new WebSocket("ws://localhost:3000");
    // 这个方法用于处理 WebSocket 连接成功建立的事件。当 WebSocket 连接成功建立后，这个事件会被触发。
    ws.onopen = () => {
      console.log("WebSocket connection established");
      // 这个方法用于向 WebSocket 服务器发送数据。当你调用这个方法时，WebSocket 会尝试将数据发送到服务器。
      ws.send(JSON.stringify(newData));
    };
  };

  return (
    <div>
      <div ref={chartRef} style={{ width: "100%", height: "400px" }}></div>
      <div>
        {data.map((value, index) => (
          <input
            key={index}
            type="number"
            value={value}
            onChange={(e) => {
              const newData = [...data];
              newData[index] = Number(e.target.value);
              setData(newData);
            }}
          />
        ))}
        <button onClick={() => handleSubmit(data)}>确认</button>
      </div>
    </div>
  );
}

export default BarChart;
