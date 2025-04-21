// 导入request模块
import request from "@/utils/request";

// 注册接口
export const register = (data) => {
  return request({
    url: "/api/register",
    method: "POST",
    data,
  });
};

// 登录接口
export const login = (data) => {
  return request({
    url: "/api/login",
    method: "POST",
    data,
  });
};

// 获取用户信息接口
export const getUserInfo = () => {
  return request({
    url: "/my/userinfo",
    method: "GET",
  });
};

// 更新用户信息接口
export const updateUserInfo = (data) => {
  return request({
    url: "/my/updateUserInfo",
    method: "POST",
    data,
  });
};

// 密码修改接口
export const updatePassword = (data) => {
  return request({
    url: "/my/updatepwd",
    method: "POST",
    data,
  });
};
