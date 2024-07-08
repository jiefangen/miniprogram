App({
  onLaunch: function () {
    console.log('App Launch')
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // TODO 初始化默认登录流程，无需用户手动确认
    
  },
  onShow: function () {
      console.log('App Show')
  },
  onHide: function () {
      console.log('App Hide')
  },
  globalData: {
    hasLogin: false,
    theme: 'dark',
    userInfo: null
  }
})
