// components/authorize/index.js
import {
  CACHE_USERINFO,
} from "../../config"
import {
  authLogin
} from "../../utils/authLogin.js"
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
      wx.getUserProfile({
        desc: '用于完善用户信息',
        success: async (res) => {
          console.log(res)
          let loginParam = {
            avatar: res.userInfo.avatarUrl,
            nickname: res.userInfo.nickName,
            encryptedData: res.encryptedData,
            iv: res.iv
          }
          // 执行登录注册逻辑
          const authLoginRes = await authLogin(this, loginParam)
          // 授权登录成功进行下一步
          if (authLoginRes && this.data.authSuccess) {
            // 根据微信获得的授权信息更新
            // let param = {
            //   encryptedData: res.encryptedData,
            //   iv: res.iv,
            //   signature: res.signature,
            //   rawData: res.rawData
            // }
            // 调用更新接口
            // let updateRes = await this.update(updateUserInfo, param)
            // if (!updateRes) {
            //   return
            // }
            // 弹出手机号码授权窗口
            this.setData({
              showAuth: "PhoneNumber",
              type: true,
            })
          }
        },
        fail(res) {
          console.error(res)
        }
      })
    },
    async getPhoneNumber(e) {
      if (e.detail.errMsg === "getPhoneNumber:ok") {
        console.log(e)
        // 组装用户更新参数
        const param = {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        }
        // 调用更新接口
        // let updateRes = await this.update(updatePhone, param)
        // if (!updateRes) {
        //   return
        // }
        //关闭隐藏接口
        this.hide()
      }
    },
    onCancel() {
      this.hide()
    },
    hide() {
      this.setData({
        showAuth: false
      })
    },
    //更新用户信息
    async update(updateApi, param) {
      this.setData({
        loading: true
      })
      let updateRes = await updateApi(param)
      this.setData({
        loading: false
      })
      if (updateRes.code !== 2000) {
        wx.showToast({
          icon: "error",
          title: "更新失败",
        })
        return false
      }
      //更新本地保存 userInfo 数据
      getApp().globalData.userInfo = updateRes.result || {}
      wx.setStorageSync(CACHE_USERINFO, JSON.stringify(updateRes.result))
      return updateRes
    }
  }
})