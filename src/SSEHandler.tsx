import { useEffect, useState } from "react";
import { useSSEStore } from "./store/sseStore";

const SSEHandler = () => {
  const addMessage = useSSEStore((state) => state.addMessage);
  const [token, setToken] = useState<string>("");

  // 监听 localStorage 的 token 变化
  useEffect(() => {
    const checkToken = () => {
      const storedToken = JSON.parse(localStorage.getItem("token") || '""');
      setToken(storedToken);
    };

    // 初始检查
    checkToken();

    // 监听 storage 事件（跨标签页）
    window.addEventListener("storage", checkToken);

    // 定期检查（用于同一标签页内的变化）
    const interval = setInterval(checkToken, 1000);

    return () => {
      window.removeEventListener("storage", checkToken);
      clearInterval(interval);
    };
  }, []);

  // 连接 EventSource
  useEffect(() => {
    // 如果没有 token，不建立连接
    if (!token || token === "") {
      console.log("未登录，跳过 SSE 连接");
      return;
    }
    
    const n = token.replace("Bearer ", "");
    console.log("建立 SSE 连接...");

    const eventSource = new EventSource(
      `http://localhost:3000/my/stream?token=${n}`
    );

    eventSource.onopen = () => {
      console.log("SSE 连接已建立");
    };

    eventSource.onmessage = (event) => {
      addMessage(event.data);
    };

    eventSource.onerror = (error) => {
      console.error("SSE 连接错误:", error);
      eventSource.close();
    };

    return () => {
      console.log("关闭 SSE 连接");
      eventSource.close();
    };
  }, [token, addMessage]);

  return null; // 不渲染任何内容
};

export default SSEHandler;
