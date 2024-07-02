import CustomPage from '../../utils/base/CustomPage'

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

import {
  CACHE_USERINFO
} from "../../config.js"

CustomPage({
  data: {
    isLoggedIn: false,  // 用于区分是否登录
    nickname: '未登录',
    username: 'unknown',
    avatarUrl: defaultAvatarUrl, // 默认头像
    dialogShow: false,
    buttons: [{ text: '取消' }, { text: '确定' }],
    // 判断微信授权弹窗
    authType: 'UserInfo',
    showAuth: false
  },
  onLoad: function () {
    // 页面加载时检查登录状态
    this.checkLoginStatus();
  },
  checkLoginStatus: function() {
    // 从存储或服务端获取登录状态
    const cacheUserInfo = wx.getStorageSync(CACHE_USERINFO)
    if (cacheUserInfo) {
      let userInfo = JSON.parse(cacheUserInfo)
      this.setData({
        isLoggedIn: true,
        username: userInfo.username,
        nickname: userInfo.nickname,
        avatarUrl: userInfo.avatar
      });
    } else {
      this.setData({
        showAuth: true, // 缓存中没有用户信息则弹出授权登录窗
        isLoggedIn: false
      });
    }
  },
  navigateToLogin: function() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },
  navigateToSettings: function() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },
  navigateToHelp: function() {
    wx.navigateTo({
      url: '/pages/help/help'
    });
  },
  navigateToLogs: function() {
    wx.navigateTo({
      url: '/pages/logs/logs'
    });
  },
  navigateToClearCache: function() {
    console.log('程序缓存清除成功');
  },
  logout: function() {
    console.log('进入用户推出逻辑流程...');
    // 实际退出登录的处理逻辑，如清除缓存、重定向到登录页面等
    this.setData({
      dialogShow: true,
    });
  },
  tapDialogButton(e) {
    console.log('退出选项结果: ', e);
    this.setData({
        dialogShow: false,
        showOneButtonDialog: false,
        isLoggedIn: false,
        nickname: '未登录',
        username: 'unknown',
        avatarUrl: defaultAvatarUrl // 重置为默认头像
    })
  },
})
