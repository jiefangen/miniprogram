import themeMixin from './behaviors/theme'

const CustomPage = function (options) {
  return Page(
    Object.assign({}, options, {
      behaviors: [themeMixin].concat(options.behaviors || []), // 将 themeMixin 行为添加到页面的行为列表中
      onLoad(query) { // 页面加载逻辑
        const app = getApp() // 获取全局应用实例
        this.themeChanged(app.globalData.theme) // 应用当前主题
        app.watchThemeChange && app.watchThemeChange(this.themeChanged) // 注册主题变化的回调
        options.onLoad && options.onLoad.call(this, query) // 调用原有的 onLoad 方法
      },
      onUnload() { // 页面卸载逻辑
        const app = getApp()
        app.unWatchThemeChange && app.unWatchThemeChange(this.themeChanged) // 注销主题变化的回调
        options.onUnload && options.onUnload.call(this) // 调用原有的 onUnload 方法
      }
    })
  )
}

export default CustomPage
