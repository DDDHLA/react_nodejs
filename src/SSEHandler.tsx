import { useEffect } from "react";
import { useSSEStore } from "./store/sseStore";

const SSEHandler = () => {
  const addMessage = useSSEStore((state) => state.addMessage);

  // 连接 EventSource
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token") || '""');
    const n = token.replace("Bearer ", "");

    const eventSource = new EventSource(
      `http://localhost:3000/my/stream?token=${n}`
    );

    eventSource.onmessage = (event) => {
      addMessage(event.data);
    };

    eventSource.onerror = () => {
      console.error("连接断开");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [addMessage]);

  return null; // 不渲染任何内容
};

export default SSEHandler;
