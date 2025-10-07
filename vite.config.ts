import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/",
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          "primary-color": "#1890ff",
          "link-color": "#1890ff",
          "border-radius-base": "4px",
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 8083, // 本地开发端口
    host: "0.0.0.0",
    allowedHosts: ["all"],
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3030",
        changeOrigin: true,
        secure: false,
      },
      "/my": {
        target: "http://127.0.0.1:3030",
        changeOrigin: true,
        secure: false,
      },
      // 百度OCR代理
      "/baidu-api": {
        target: "https://aip.baidubce.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/baidu-api/, ""),
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      },
    },
  },
});
