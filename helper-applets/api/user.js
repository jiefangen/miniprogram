import request from "../utils/request"

// 用户登录
export function login(data) {
  return request.post("/app/login", data, {
    noAuth: true
  });
}

// 获取用户信息
export function getUserInfo(data) {
  return request.post("/app/user/info", data);
}
