import {
  authLogin
} from "/utils/authLogin.js"

App({
  onLaunch: function () {
    console.log('App Launch')
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    if (this.globalData.autoLogin) {
      // 初始化默认登录流程，无需用户手动确认
      wxDefaultLogin()
    }
  },
  onShow: function () {
      console.log('App Show')
  },
  onHide: function () {
      console.log('App Hide')
  },
  globalData: {
    hasLogin: false,
    autoLogin: true,
    userInfo: null
  }
})

async function wxDefaultLogin() {
  wx.getUserInfo({
    desc: '用于完善用户信息',
    success: async (res) => {
      let loginParam = {
        avatar: res.userInfo.avatarUrl,
        nickname: res.userInfo.nickName,
        encryptedData: {
          encryptedData: res.encryptedData,
          iv: res.iv
        }
      }
      // 执行登录注册逻辑
      const authLoginRes = await authLogin(null, loginParam)
      // 授权登录成功进行下一步
      if (authLoginRes) {
        // 登录成功后，跳转并重新加载页面
        wx.reLaunch({
          url: '/pages/index/index'
        })
      }
    },
    fail(res) {
      console.error(res)
    }
  })
}