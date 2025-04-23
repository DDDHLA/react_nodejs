import React, { useEffect, useState } from "react";

const Publish: React.FC = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token") || '""');
    const n = token.replace("Bearer ", "");
    const ws = new WebSocket(`ws://localhost:3000?token=${n}`);
    ws.onopen = () => {
      console.log("连接成功");
    };

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

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
