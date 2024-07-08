import {
  CACHE_USERINFO,
  CACHE_TOKEN,
  APP_ID,
  CACHE_CODE,
  CACHE_CODE_TIME,
  CACHE_TOKEN_TIME,
  CODE_EFFECTIVE_TIME,
  TOKEN_EFFECTIVE_TIME,
  CACHE_TOKEN_EXPIRED_INTERVAL
} from "../config"

const {
  login
} = require("../api/user");

export async function authLogin(instance, loginParam) {
  const cacheUserInfo = wx.getStorageSync(CACHE_USERINFO)
  let userInfo = cacheUserInfo ? JSON.parse(cacheUserInfo) : {}
  getApp().globalData.userInfo = userInfo
  
  // 有token时，不需要重新登录
  const token = wx.getStorageSync(CACHE_TOKEN)
  const tokenTime = wx.getStorageSync(CACHE_TOKEN_TIME)
  let tokenEffectiveTime = wx.getStorageSync(CACHE_TOKEN_EXPIRED_INTERVAL)
  if (!tokenEffectiveTime) { // 优先使用服务返回的token有效时间
    tokenEffectiveTime = TOKEN_EFFECTIVE_TIME
  }
  if (token && (tokenTime + tokenEffectiveTime > (new Date()).getTime())) { // 缓存中有token并且在有效期内
    return authMain(instance, userInfo)
  }
  
  // 防止第一次经入小程序时，反复调用 wx.login，超出频率规范
  const code = wx.getStorageSync(CACHE_CODE)
  const codeTime = wx.getStorageSync(CACHE_CODE_TIME)
  if (code && (codeTime + CODE_EFFECTIVE_TIME > (new Date()).getTime())) { // 缓存中有code并且在有效期内
    const loginRes = await loginMain(loginParam, code)
    return authMain(instance, loginRes.data)
  }

  // 微信首次登录异步处理
  // wx.login({
  //   success: async (res) => {
  //     if (res.code) {
  //       const loginRes = await loginMain(loginParam, res.code)
  //       authMain(instance, loginRes.data)
  //     } else {
  //       console.log('登录失败！' + res.errMsg)
  //     }
  //   }
  // })
  
  // 微信首次登录同步处理
  const wxCode = await wxLogin()
  const loginRes = await loginMain(loginParam, wxCode)
  return authMain(instance, loginRes.data)
}

// 封装同步微信登录调用
async function wxLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(new Error('微信登录失败' + res.errMsg));
        }
      },
      fail: (err) => {
        reject(new Error('微信登录失败' + err.errMsg));
      }
    });
  });
}

//调用 token 和 储存用户token等信息
async function loginMain(loginParam, code) {
  const accountInfo = wx.getAccountInfoSync();
  let appId = accountInfo.miniProgram.appId
  let data = {
    appid: appId,
    code: code,
    username: loginParam.username,
    avatar: loginParam.avatar,
    nickname: loginParam.nickname,
    encryptedData: loginParam.encryptedData
  }
  const loginRes = await login(data)
  if (loginRes.success) {
    wx.setStorageSync(APP_ID, appId) 
    wx.setStorageSync(CACHE_TOKEN, loginRes.data.token)
    wx.setStorageSync(CACHE_TOKEN_EXPIRED_INTERVAL, loginRes.data.tokenEffectiveTime)
    wx.setStorageSync(CACHE_TOKEN_TIME, (new Date()).getTime())
    wx.setStorageSync(CACHE_CODE, code)
    wx.setStorageSync(CACHE_CODE_TIME, (new Date()).getTime())
    wx.setStorageSync(CACHE_USERINFO, JSON.stringify(loginRes.data))
    const globalData = getApp().globalData
    globalData.userInfo = loginRes.data || {}
    globalData.hasLogin = true
    return loginRes
  }
  return {}
}

async function authMain(instance, userInfo) {
  // 用户信息获取成功
  if (userInfo && userInfo.userId) {
    instance.setData({
      authSuccess: true,
      hasUserInfo: true,
      showAuth: false,
      userInfo: userInfo
    })
  } else {
    return false
  }
  // 判断用户名或者用户ID是否为空，弹出授权窗口
  if (!userInfo.userId || !userInfo.username) {
    instance.setData({
      authType: 'UserInfo',
      showAuth: true
    })
    return false
  }
  //这里可以调用首页需要的api并跳转到首页
  // wx.switchTab({
  //   url: '/pages/index/index',
  // })
  return true
}