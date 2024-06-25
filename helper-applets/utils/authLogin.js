import {
  CACHE_USERINFO,
  CACHE_TOKEN,
  APP_ID,
  CACHE_CODE,
  CACHE_CODE_TIME,
  CACHE_TOKEN_TIME,
  CODE_EFFECTIVE_TIME,
  TOKEN_EFFECTIVE_TIME,
} from "../config"

const {
  login
} = require("../api/user");

export async function authLogin(instance) {
  const cacheUserInfo = wx.getStorageSync(CACHE_USERINFO)
  let userInfo = cacheUserInfo ? JSON.parse(cacheUserInfo) : {}
  getApp().globalData.userInfo = userInfo
  
  // 有token时，不需要重新登录
  const token = wx.getStorageSync(CACHE_TOKEN)
  const tokenTime = wx.getStorageSync(CACHE_TOKEN_TIME)
  if (token && (tokenTime + TOKEN_EFFECTIVE_TIME > (new Date()).getTime())) { // 缓存中有token并且在有效期内
    return authMain(instance, userInfo)
  }
  
  // 防止第一次经入小程序时,反复调用 wx.login，超出频率规范
  const code = wx.getStorageSync(CACHE_CODE)
  const codeTime = wx.getStorageSync(CACHE_CODE_TIME)
  if (code && (codeTime + CODE_EFFECTIVE_TIME > (new Date()).getTime())) { // 缓存中有code并且在有效期内
    const loginRes = await loginMain(userInfo, code)
    return authMain(instance, loginRes.data)
  }
  wx.login({
    success: async (res) => {
      if (res.code) {
        const loginRes = await loginMain(userInfo, res.code)
        authMain(instance, loginRes.data)
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  })
}
//调用 token 和 储存用户token等信息
async function loginMain(userInfo, code) {
  const accountInfo = wx.getAccountInfoSync();
  let appId = accountInfo.miniProgram.appId
  const data = {
    appid: appId,
    code: code,
    username: userInfo.username,
    avatar: userInfo.avatarUrl,
    nickname: userInfo.nickName
  }
  const loginRes = await login(data)
  console.log(loginRes)

  wx.setStorageSync(APP_ID, appId) 
  wx.setStorageSync(CACHE_TOKEN, loginRes.data.token) 
  wx.setStorageSync(CACHE_TOKEN_TIME, (new Date()).getTime())
  wx.setStorageSync(CACHE_CODE, code)
  wx.setStorageSync(CACHE_CODE_TIME, (new Date()).getTime())
  wx.setStorageSync(CACHE_USERINFO, JSON.stringify(loginRes.data))
  const globalData = getApp().globalData
  globalData.userInfo = loginRes.data || {}
  return loginRes
}

async function authMain(instance, userInfo) {
  //判断用户名是否为空，弹出授权窗口
  if (!userInfo.username) {
    instance.setData({
      authType: "UserInfo",
      isShowAuth: true
    })
    return
  }
  //这里可以调用首页需要的api并跳转到首页
  wx.switchTab({
    url: '/pages/index/index',
  })
}