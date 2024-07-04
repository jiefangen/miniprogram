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
    userProfile: {
      avatarUrl: defaultAvatarUrl,
      username: '',
      nickName: ''
    },
    userInfo: {},
    hasUserInfo: false,
    authSuccess: false,
    loading: false,
    // 判断获取微信用户信息组件等是否在当前版本可用
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname')
  },
  onLoad: function () {
    const cacheUserInfo = wx.getStorageSync(CACHE_USERINFO)
    if (cacheUserInfo) {
      let userInfo = JSON.parse(cacheUserInfo)
      this.setData({
        hasUserInfo: true,
        userInfo: userInfo
      })
    }
  },
  bindAuthLogin: function () {
    this.setData({
      loading: true
    })
    wx.getUserProfile({
      desc: '用于完善用户信息',
      success: async (res) => {
        // console.log(res) // 微信授权用户信息日志打印
        let loginParam = {
          avatar: res.userInfo.avatarUrl,
          nickname: res.userInfo.nickName
        }
        // 执行登录注册逻辑
        const authLoginRes = await authLogin(this, loginParam)
        if (authLoginRes && this.data.authSuccess) {
          //这里可以调用首页需要的api并跳转到首页
          wx.switchTab({
            url: '/pages/index/index',
          })
          // 授权成功弹出登录成功提示
          if (this.data.authSuccess) {
            wx.showToast({
              icon: "none",
              title: '登录成功',
              duration: 1000
            })
          }
        }
        this.setData({
          loading: false
        })
      }
    })
  }
})
