// "release" 正式版  "trial" 体验版 "develop" 开发版 
const env = wx.getAccountInfoSync().miniProgram.envVersion

const HTTP_REQUEST_URL = env === "release" ? "https://kite1874.com/api/" : env === "trial" ? "https://kite1874.com/test/api/" : "http://localhost:10003/helper-app"

module.exports = {
  //请求接口地址，根URL
  HTTP_REQUEST_URL,

  // 腾讯位置服务 Key
  MAP_KEY: "VP4BZ-MPBCU-LQFVU-BXR22-CFNTS-WLFZN",

  // 请求头
  HEADER: {
    'content-type': 'application/json',
    'app-source': 'WECHAT-MINI'
  },
  // 小程序appid
  APP_ID: 'APPID',
// 回话密钥名称 
  TOKENNAME: 'Authorization',
  //用户信息缓存名称
  CACHE_USERINFO: 'USERINFO',
  //code
  CACHE_CODE: "CODE",
  //code获取时间戳
  CACHE_CODE_TIME: "CODETIME",
  //微信官方称code有效时间为五分钟，保险起见设置4.5分钟
  CODE_EFFECTIVE_TIME: 270000,
  //token缓存名称
  CACHE_TOKEN: 'TOKEN',
  //token获取时间戳
  CACHE_TOKEN_TIME: 'CACHE_TOKEN_TIME',
  //token有效时间，23小时
  TOKEN_EFFECTIVE_TIME: 82800000,
}