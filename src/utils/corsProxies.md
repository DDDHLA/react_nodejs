# 🚀 前端直接调用百度OCR的方案

## 方案对比

| 方案 | 难度 | 成本 | 稳定性 | 推荐度 |
|------|------|------|--------|--------|
| CORS代理 | ⭐ | 免费 | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 浏览器扩展 | ⭐⭐⭐ | 免费 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 本地代理 | ⭐⭐ | 免费 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 后端API | ⭐⭐⭐⭐ | 服务器费用 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## 🎯 方案1：CORS代理（最简单）

### 免费CORS代理服务：
1. **cors-anywhere.herokuapp.com** (需要申请)
2. **api.allorigins.win** (直接使用)
3. **corsproxy.io** (直接使用)
4. **proxy.cors.sh** (直接使用)

### 使用方法：
```javascript
// 替换代理URL即可
const proxyUrl = 'https://api.allorigins.win/raw?url=';
const response = await fetch(proxyUrl + baiduApiUrl, options);
```

## 🔧 方案2：本地CORS代理

### 安装本地代理：
```bash
npm install -g cors-anywhere
cors-anywhere
```

### 或使用简单的Node.js脚本：
```javascript
// proxy-server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use('/api/baidu', createProxyMiddleware({
  target: 'https://aip.baidubce.com',
  changeOrigin: true,
  pathRewrite: { '^/api/baidu': '' }
}));

app.listen(8080);
```

## 🌐 方案3：浏览器扩展

### Chrome扩展manifest.json：
```json
{
  "manifest_version": 3,
  "name": "OCR Helper",
  "permissions": ["activeTab"],
  "host_permissions": ["https://aip.baidubce.com/*"],
  "content_scripts": [{
    "matches": ["http://localhost:*/*"],
    "js": ["content.js"]
  }]
}
```

## 🎨 方案4：Electron桌面应用

将Web应用打包为桌面应用，绕过浏览器CORS限制：

```bash
npm install electron --save-dev
```

## 💡 推荐使用顺序

1. **先试CORS代理** - 最简单，立即可用
2. **本地代理** - 稳定性好，开发友好
3. **浏览器扩展** - 用户体验最佳
4. **后端API** - 生产环境最佳

## 🔑 当前配置

你的API Key已经配置好了：
- API_KEY: HZ41w4QGOJqkJqEBKkTawins
- SECRET_KEY: iCOkMQ0NbA1syHujNNcThOBtloVxssU5

只需要解决跨域问题就能使用真实的百度OCR！
