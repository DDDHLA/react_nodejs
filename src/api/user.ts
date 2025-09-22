// 导入request模块
import request from "../utils/request";

// 定义API响应的基础接口
export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
}

// 定义用户注册请求参数接口
export interface RegisterParams {
  username: string;
  password: string;
  nickname?: string;
  email?: string;
}

// 定义用户登录请求参数接口
export interface LoginParams {
  username: string;
  password: string;
}

// 定义用户信息接口
export interface UserInfo {
  id: number;
  username: string;
  nickname?: string;
  email?: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

// 定义更新用户信息请求参数接口
export interface UpdateUserInfoParams {
  nickname?: string;
  email?: string;
  avatar?: string;
}

// 定义更新密码请求参数接口
export interface UpdatePasswordParams {
  oldPassword: string;
  newPassword: string;
}

// 注册接口
export const register = (data: RegisterParams): Promise<ApiResponse> => {
  return request({
    url: "/api/register",
    method: "POST",
    data,
  });
};

// 登录接口
export const login = (data: LoginParams): Promise<ApiResponse<{ token: string; userInfo: UserInfo }>> => {
  return request({
    url: "/api/login",
    method: "POST",
    data,
  });
};

// 获取用户信息接口
export const getUserInfo = (): Promise<ApiResponse<UserInfo>> => {
  return request({
    url: "/my/userinfo",
    method: "GET",
  });
};

// 更新用户信息接口
export const updateUserInfo = (data: UpdateUserInfoParams): Promise<ApiResponse<UserInfo>> => {
  return request({
    url: "/my/updateUserInfo",
    method: "POST",
    data,
  });
};

// 密码修改接口
export const updatePassword = (data: UpdatePasswordParams): Promise<ApiResponse> => {
  return request({
    url: "/my/updatepwd",
    method: "POST",
    data,
  });
};
