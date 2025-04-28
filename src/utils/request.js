import { message } from "antd";
import axios from "axios";

// 创建axios实例
const service = axios.create({
  baseURL: "http://127.0.0.1:3000", // 请求的基础URL
  timeout: 5000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 比如在请求头中添加token
    // config.headers.Authorization = localStorage.getItem("token");
    config.headers.Authorization =
      JSON.parse(localStorage.getItem("token")) || "";
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    // 请求成功，业务失败
    // if (response.data.status === 401) {
    //   window.location.href = "/login";
    //   localStorage.removeItem("token");
    //   message.error(response.data.message);
    //   console.log(response.data.message);
    //   return;
    // }

    if (response.data.status === 401) {
      message.error(response.data.message); // 先提示
      localStorage.removeItem("token");
      // 延迟跳转
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500); // 1.5秒后跳转，足够用户看到提示
      return;
    }
    return response.data;
  },
  (error) => {
    // 处理响应错误
    // 401 未登录
    // if (error.response.status === 401) {
    //   localStorage.removeItem("token");
    //   window.location.href = "/login";
    // }
    return Promise.reject(error);
  }
);

export default service;
