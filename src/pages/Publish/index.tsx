import { useEffect, useState } from "react";

const Publish: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // 连接WebSocket
    // 代码解释 ws://localhost:3000 是 WebSocket 的协议，localhost:3000 是 WebSocket 服务器的地址
    // ?token=Bearer 你的token
    const token = JSON.parse(localStorage.getItem("token") || '""');
    const n = token.replace("Bearer ", "");
    const ws = new WebSocket(`ws://localhost:3000?token=${n}`);
    ws.onopen = () => {
      console.log("连接成功");
    };

    // 接收消息
    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    // 关闭连接
    ws.onclose = () => {
      console.log("连接关闭");
    };

    ws.onerror = (error) => {
      console.error("WebSocket 出错:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div style={{ padding: "20px", fontSize: "20px", whiteSpace: "pre-wrap" }}>
      {messages.join("")}
    </div>
  );
};

export default Publish;
