const ArticleService = require('../../utils/service/article.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articles: [],
    articleType: [],
    imagesList: [],
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const type = options.type;
    let articles = [];
    ArticleService.getData('https://api.zhaobg.com/jsonapi/node/article?fields[node--article]=title,field_author,field_type,field_image,changed,body&include=field_image&sort=-changed').then(res => {
      console.log(res)

      if (res.included) {
        let myObj = {};
        const imagesList = res.included.map(function (obj) {
          myObj[obj.id] = `https://api.zhaobg.com${obj.attributes.uri.url}`;
        })
        this.setData({
          imagesList: myObj
        })
      }

      articles = res.data;
      const list = articles.filter(article => article.attributes.field_type.indexOf(type) > -1)
      // console.log(list)
      this.setData({
        articles: list,
        loading: false
      })
    })
  },

  onTabNode(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/node/node?id=${id}`
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