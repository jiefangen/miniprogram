import CustomPage from '../../utils/base/CustomPage'

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

import {
  CACHE_USERINFO
} from "../../config.js"

import {
  authLogin
} from "../../utils/authLogin.js"

CustomPage({
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      username: '',
      nickName: ''
    },
    hasUserInfo: false,
    // 判断获取微信用户信息组件等是否在当前版本可用
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname')
  },
  onLoad: function () {
  },
  bindAuthLogin: function () {
    wx.getUserProfile({
      desc: '用于完善用户信息',
      success: (res) => {
        console.log(res) // 日志打印
        this.setData({
          hasUserInfo: true,
          userInfo: res.userInfo
        })
        const userInfo = wx.getStorageSync(CACHE_USERINFO)
        if (!userInfo) { // 只有首次登录的时候才会预缓存用户信息
          wx.setStorageSync(CACHE_USERINFO, JSON.stringify(res.userInfo))
        }
        // 登录注册逻辑
        authLogin(this, )
        wx.showToast({
          icon: "none",
          title: '登录成功',
          duration: 1000
        })
      }
    })
  }
})
