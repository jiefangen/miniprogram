import {
  HEADER,
  TOKENNAME,
  CACHE_TOKEN,
  HTTP_REQUEST_URL,
} from './../config.js';

/*
  api：Stirng 接口URL
  method ：Stirng 请求方法 ：get post
  data：Object  请求数据
  noAuth: Boolean true，不需要携带 token; false,反之
  customHeader：自定义请求头（覆盖默认的）
  baseURL: 覆盖默认的 baseURL
*/
export default function request(api, method, data, {
  noAuth = false,
  customHeader = null,
  baseURL = ''
}) {
  let header = customHeader || HEADER;
  const token = wx.getStorageSync(CACHE_TOKEN)
  if (!noAuth && token) header[TOKENNAME] = token
  return new Promise((reslove, reject) => {
    wx.request({
      url: (baseURL || HTTP_REQUEST_URL) + api,
      method: method || 'GET',
      header: header,
      data: data || {},
      success: (res) => {
      // 4014: Illegal token; 4018: Token expired;
      if (res.code === 4014 || res.code === 4018 || res.code === 5006 || res.code === 5012) {
          wx.removeStorageSync(CACHE_TOKEN)
          wx.showToast({
            type: "loading",
            title: '登录凭证已失效，请重新登录。。。',
          })
          wx.switchTab({
            url: '/pages/login/login',
          })
          reject(null);
        }
        reslove(res.data || null)
      },
      fail: (msg) => {
        wx.hideLoading()
        wx.showToast({
          icon: "none",
          title: "请求失败，服务器异常"
        })
        reject(null);
      }
    })
  });
}

['options', 'get', 'post', 'put', 'head', 'delete', 'trace', 'connect'].forEach((method) => {
  request[method] = (api, data, opt) => request(api, method, data, opt || {})
});