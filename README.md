## zustand用法
```
npm i zustand
```
建立仓库
```
import { create } from 'zustand';

const useCounterStore = create((set, get) => {
  return {
    count: 0,

    increase: function () {
      const state = get();
      set({ count: state.count + 1 });
    },

    decrease: function () {
      const state = get();
      set({ count: state.count - 1 });
    },

    reset: function () {
      set({ count: 0 });
    },
  };
});

export default useCounterStore;
```
或
```
import { create } from 'zustand';

const useCounterStore = create((set) => ({
  count: 0,

  increase: () =>
    set((state) => ({
      count: state.count + 1,
    })),

  decrease: () =>
    set((state) => ({
      count: state.count - 1,
    })),

  reset: () =>
    set(() => ({
      count: 0,
    })),
}));

export default useCounterStore;
```
使用仓库
```
import useCounterStore from './useCounterStore';
function Counter() {
  const { count, increase, decrease, reset } = useCounterStore();
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={increase}>Increase</button>
      <button onClick={decrease}>Decrease</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```
或
```
import useCounterStore from './useCounterStore';
function Counter() {
  const { count, increase, decrease, reset } = useCounterStore((state) => ({
    count: state.count,
    increase: state.increase,
    decrease: state.decrease,
    reset: state.reset,
  }));
  return (
    <div> 
      <h1>Count: {count}</h1>
      <button onClick={increase}>Increase</button>
      <button onClick={decrease}>Decrease</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

## 客户端ws
```js
//用于创建一个新的 WebSocket 连接。 url 是 WebSocket 服务器的地址。
const ws = new WebSocket("ws://localhost:3000");
//当 WebSocket 连接成功建立时触发。可以在这里执行一些初始化操作，比如发送初始数据。
ws.onopen
// 当从服务器接收到消息时触发。可以在这里处理接收到的数据。
ws.onmessage
// 当 WebSocket 连接关闭时触发。可以在这里执行一些清理操作。
ws.onclose
// 当 WebSocket 连接发生错误时触发。可以在这里处理错误。
ws.onerror
```

## 服务端
```js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });
wss.on("connection", (ws, req) => {
  console.log("客户端已连接");
  // 当客户端发送消息时触发，可以在这里处理接受的消息。
  ws.on("message", (message) => {
    console.log(`Received message => ${message}`);
    chartData = JSON.parse(message);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        // 发送消息给所有连接的客户端
        client.send(JSON.stringify(chartData));
      }
    });
  });

  ws.send(JSON.stringify(chartData));
});
```
```
在 WebSocket 通信中，客户端和服务端的方法有一些区别。以下是一些关键的区别和常用的方法：

### 客户端方法
1. new WebSocket(url) :
   
   - 用于创建一个新的 WebSocket 连接。 url 是 WebSocket 服务器的地址。
2. ws.onopen :
   
   - 当 WebSocket 连接成功建立时触发。可以在这里执行一些初始化操作，比如发送初始数据。
3. ws.onmessage :
   
   - 当从服务器接收到消息时触发。可以在这里处理接收到的数据。
4. ws.onclose :
   
   - 当 WebSocket 连接关闭时触发。可以在这里执行一些清理操作。
5. ws.onerror :
   
   - 当 WebSocket 连接发生错误时触发。可以在这里处理错误。
6. ws.send(data) :
   
   - 用于向服务器发送数据。 data 可以是字符串、Blob 或 ArrayBuffer。
### 服务端方法
在 Node.js 中，通常使用 ws 库来处理 WebSocket 连接。以下是一些常用的方法：

1. wss.on('connection', callback) :
   
   - 当有新的客户端连接时触发。 callback 函数接收一个 WebSocket 对象作为参数。
2. ws.on('message', callback) :
   
   - 当接收到客户端发送的消息时触发。可以在这里处理接收到的数据。
3. ws.send(data) :
   
   - 用于向客户端发送数据。 data 可以是字符串或 Buffer。
4. ws.on('close', callback) :
   
   - 当连接关闭时触发。可以在这里执行一些清理操作。
5. ws.on('error', callback) :
   
   - 当连接发生错误时触发。可以在这里处理错误。
```