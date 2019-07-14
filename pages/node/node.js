const ArticleService = require('../../utils/service/article.js');

// see https://github.com/icindy/wxParse
var WxParse = require('../../utils/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    banner: '',
    node: {},
    date: ''
  },

  onPullDownRefresh() {
    this.getNode(this.data.id, () => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      id: options.id
    })
    
    const res = wx.getStorageSync('_res');
    if (res) {
      this.getNode(this.data.id, res)
    } else {
      ArticleService.getData('https://api.zhaobg.com/jsonapi/node/article?fields[node--article]=title,field_author,field_type,field_image,changed,body&include=field_image&sort=-changed').then(res => {
        console.log(res)
        this.getNode(this.data.id, res);

        // 缓存数据
        wx.setStorageSync('_res', res);
      })
    }

  },

  getNode(id, res) {
    console.log(id, res)
    let nodes = res.data;
    const nodeData = nodes.filter(article => article['id'] == id);
    const node = nodeData[0].attributes;
    const included = res.included;
    const bannerId = nodeData[0].relationships.field_image.data.id;
    let banner = included.filter(image => image['id'] == bannerId);
    const bannerImg = `https://api.zhaobg.com${banner[0].attributes.uri.url}`;
    console.log(node)
    const date = new Date(node.changed);
    this.setData({
      banner: `${bannerImg}`,
      node: node,
      date: `${date.getUTCHours()}:${date.getMinutes()}`
    })
    WxParse.wxParse('article', 'html', node.body.value, this, 5)
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