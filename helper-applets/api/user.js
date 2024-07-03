import request from "../utils/request"

// 用户登录
export function login(data) {
  return request.post("/app/login", data, {
    noAuth: true
  });
}

// 获取用户信息
export function getUserInfo() {
  return request.get("/app/user/info");
}

// 更信用户信息
export function updateUser(data) {
  return request.post("/app/user/update", data);
}

// 用户登出
export function logout() {
  return request.get("/app/logout");
}
