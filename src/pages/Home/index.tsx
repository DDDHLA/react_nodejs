// import React, { useEffect, useState } from "react";

// const Home: React.FC = () => {
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     // 虽然 EventSource 不支持自定义 headers，但可以通过 URL 参数传 token
//     // const eventSource = new EventSource("http://localhost:3000/my/stream");

//     const token = JSON.parse(localStorage.getItem("token")) || "";
//     const n = token.replace("Bearer ", "");
//     const eventSource = new EventSource(
//       `http://localhost:3000/my/stream?token=${n}`
//     );

//     eventSource.onmessage = (event) => {
//       setMessages((prev) => [...prev, event.data]);
//     };

//     eventSource.onerror = () => {
//       console.error("连接断开");
//       eventSource.close();
//     };

//     return () => {
//       eventSource.close();
//     };
//   }, []);

//   return (
//     <div style={{ padding: "20px", fontSize: "20px", whiteSpace: "pre-wrap" }}>
//       {messages.join("")}
//     </div>
//   );
// };

// export default Home;

import React from "react";
import { useSSEStore } from "../../store";

const Home: React.FC = () => {
  const messages = useSSEStore((state) => state.messages);

  return (
    <div style={{ padding: "20px", fontSize: "20px", whiteSpace: "pre-wrap" }}>
      {messages.join("")}
    </div>
  );
};

export default Home;
