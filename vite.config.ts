import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0", // 确保监听所有地址，以便 ngrok 可以访问
    port: 5173, // 确保端口与 ngrok 转发的端口一致
    allowedHosts: [
      "all", // 添加您的 ngrok 域名
      // 如果您希望允许所有主机（在开发环境中更方便，但安全性稍低），可以使用 'all'
      // 'all',
    ],
  },
});
