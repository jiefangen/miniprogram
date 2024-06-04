const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Component({
  data: {
    username: '张三',
    email: 'zhangsan@example.com',
    phone: '12345678901',
    avatarUrl: defaultAvatarUrl // 默认头像
  },
  onLoad: function () {
    // 页面加载
    // 你可以在这里添加获取用户信息的逻辑
  }
})
