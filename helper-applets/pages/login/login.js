import CustomPage from '../../utils/base/CustomPage'

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

import {
  authLogin
} from "../../utils/authLogin.js"

CustomPage({
  data: {
    // 判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    avatarUrl: defaultAvatarUrl,
  },
  onLoad: function () {
    // 查看是否授权
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  },
  bindGetUserInfo: function (e) { //点击的“拒绝”或者“允许
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) { //点击了“允许”按钮，
      wx.login({ // 调用微信登录api
        success: function (res) { // 这一步是获取用户在小程序里的临时code码
          console.log(res)
          // app.http.getOpenId({ // 请求后台接口，用code码换取用户信息openid或者token
          //   js_code: res.code,
          // }).then(res => {
          //   wx.setStorageSync('openid', res.data.openid)
          //   wx.setStorageSync('Token', res.data.Token)
          // })
        },
        fail: function (res) { // 获取code码失败的方法
          console.log(res)
        }
      })
    } else {
    	//用户点击拒绝逻辑
    }
  }
})
