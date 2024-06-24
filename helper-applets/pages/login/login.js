import CustomPage from '../../utils/base/CustomPage'

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

import {
  authLogin
} from "../../utils/authLogin.js"

CustomPage({
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
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
        console.log(res)
        this.setData({
          hasUserInfo: true,
          userInfo: res.userInfo
        })
        // 登录注册逻辑

      }
    })
  }
})
