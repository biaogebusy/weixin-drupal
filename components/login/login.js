// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  onLoad: function(){
    wx.getSetting({
      success(res) {
        console.log(res)
      }
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTapLogin(event) {
      const loginDetail = {
        userInfo: event.detail.userInfo
      }
      console.log(loginDetail)
      this.triggerEvent('onLogin', loginDetail)
    }
  }
})
