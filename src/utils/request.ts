import { message } from "antd";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// 定义请求配置接口
export interface RequestConfig extends AxiosRequestConfig {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: unknown;
  params?: Record<string, unknown>;
}

// 创建axios实例（开发环境使用vite代理，生产环境使用相对路径）
const baseURL =
  import.meta?.env?.VITE_API_BASE || (import.meta?.env?.DEV ? "" : ""); // 开发环境使用代理，生产环境使用相对路径

const service = axios.create({
  baseURL,
  timeout: 5000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 比如在请求头中添加token
    const token = localStorage.getItem("token");
    if (token) {
      // 如果token是JSON字符串，解析它；否则直接使用
      try {
        const parsedToken = JSON.parse(token);
        config.headers.Authorization = parsedToken;
      } catch {
        // 如果解析失败，说明token本身就是字符串
        config.headers.Authorization = token;
      }
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    // 请求成功，业务失败
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

// 导出请求函数
const request = <T = unknown>(config: RequestConfig): Promise<T> => {
  return service(config);
};

export default request;
