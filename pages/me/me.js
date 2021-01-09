// pages/me/me.js
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow: function(){
    util.getUserInfo().then(userInfo => {
      console.log(userInfo)
      this.setData({
        userInfo
      })
    }).catch(()=>{
      console.log('请认证！')
    })
  },
  onTabLogin: function(event){
    console.log(event)
    this.setData({
      userInfo: event.detail.userInfo
    })
  }
})