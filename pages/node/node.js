// pages/node/node.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    node: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id
    })
    this.getNode(this.data.id)
  },

  getNode(id) {
    wx.request({
      url: `https://api.zhaobg.com/jsonapi/node/article/${id}`,
      header: {
        Accept: 'application/vnd.api+json'
      },
      success: (res) => {
        console.log(res)
        const node = res.data.data.attributes;
        this.setData({
          node: node
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})