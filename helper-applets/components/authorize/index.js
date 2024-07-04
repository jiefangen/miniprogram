// components/authorize/index.js
import {
  CACHE_USERINFO,
} from "../../config"
import {
  authLogin
} from "../../utils/authLogin.js"
const {
  getUserInfo,
  updateUser
} = require("../../api/user")
Component({
  properties: {
    type: {
      type: String,
      value: "UserInfo"
    },
    showAuth: {
      type: Boolean,
      value: false
    },
    // 登录成功后跳转的路径
    path: {
      type: String,
      value: ""
    }
  },

  data: {
    authSuccess: false,
    loading: false
  },
  /**
   * 组件的方法列表
   */
  lifetimes: {},
  methods: {
    bindAuthLogin: function () {
      this.setData({
        loading: true
      })
      wx.getUserProfile({
        desc: '用于完善用户信息',
        success: async (res) => {
          // console.log(res)
          let loginParam = {
            avatar: res.userInfo.avatarUrl,
            nickname: res.userInfo.nickName,
            encryptedData: {
              encryptedData: res.encryptedData,
              iv: res.iv
            }
          }
          // 执行登录注册逻辑
          const authLoginRes = await authLogin(this, loginParam)
          // 授权登录成功进行下一步
          if (authLoginRes && this.data.authSuccess) {
            let userInfo = getApp().globalData.userInfo
            if (!userInfo.phone) { // 缓存用户中没有手机号
              // 弹出手机号码授权窗口
              this.setData({
                showAuth: "PhoneNumber",
                type: true
              })
            } else {
              this.hide()
            }
            // 登录成功后，跳转并重新加载页面
            let path = this.data.path
            if (path) {
              wx.reLaunch({
                url: path
              })
            }
          }
          this.setData({
            loading: false
          })
        },
        fail(res) {
          console.error(res)
        }
      })
    },

    async getPhoneNumber(e) {
      this.setData({
        loading: true
      })
      if (e.detail.errMsg === "getPhoneNumber:ok") {
        console.log(e)
        // 组装更新加密参数
        const param = {
          userId: this.data.userInfo.userId,
          encryptedData: {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          }
        }
        // 调用更新接口
        let updateRes = await this.update(param)
        if (updateRes && updateRes.code == 2000) {
          // 更新本地保存userInfo数据
          let userInfoRes = await getUserInfo()
          getApp().globalData.userInfo = userInfoRes.data || {}
          wx.setStorageSync(CACHE_USERINFO, JSON.stringify(userInfoRes.data))
        } else {
          return
        }
        //关闭隐藏接口
        this.hide()
      }
    },
    onCancel() {
      this.hide()
    },
    hide() {
      this.setData({
        showAuth: false,
        loading: false
      })
    },

    // 更新用户信息
    async update(param) {
      let updateRes = await updateUser(param)
      if (updateRes.code !== 2000) {
        wx.showToast({
          icon: "error",
          title: "更新失败",
        })
        return false
      }
      return updateRes
    }
  }
})