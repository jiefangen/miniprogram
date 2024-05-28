import request from "../utils/request"

//小程序用户登录
export function login(code, data) {
  return request.post(`login?code=${code}`, data, {
    noAuth: true
  });
}

//更新用户信息
export function updateUserInfo(data) {
  return request.post("user/profile", data);
}

//更新用户手机号
export function updatePhone(data) {
  return request.post("user/phone", data);
}