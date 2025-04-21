import request from "../utils/request";

// 获取文章分类列表
export const getArticlesType = (data) => {
  return request({
    url: "/my/articles/cates",
    method: "POST",
    data,
  });
};

// 删除文章分类
export const deleteArticlesType = (id) => {
  return request({
    url: `/my/articles/delcate`,
    method: "POST",
    data: {
      id,
    },
  });
};

// 新增文章分类
export const addArticlesType = (data) => {
  console.log(data);
  return request({
    url: `/my/articles/addcate`,
    method: "POST",
    // headers: {
    //   "Content-Type": "multipart/form-data", // This is important when using FormData
    // },
    data,
  });
};

// 下载
export const download = (id) => {
  return request({
    url: `/my/articles/download`,
    method: "POST",
    data: {
      id,
    },
    responseType: "blob",
  });
};
