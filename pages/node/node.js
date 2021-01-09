const ArticleService = require('../../utils/service/article.js');
const base = require('../../utils/service/base.js');
const util = require('../../utils/util.js');
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
    wx.showLoading({
      title: "加载中..."
    })
    // console.log(options)
    this.setData({
      id: options.id
    })

    const res = wx.getStorageSync('_res');
    if (res) {
      wx.hideLoading();
      this.getNode(this.data.id, res)
    } else {
      ArticleService.getData(`${base.getApiUrl()}${base.getNodePath()}?fields[node--article]=title,field_author,field_type,field_image,changed,body&include=field_image&sort=-changed`).then(res => {
        wx.hideLoading();
        this.getNode(this.data.id, res);

        // 缓存数据
        wx.setStorageSync('_res', res);
      }).catch(err => {
        console.log(err);
        wx.hideLoading();
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
    const bannerImg = `${base.getApiUrl()}${banner[0].attributes.uri.url}`;
    console.log(node)
    const date = util.formatTime(new Date(node.changed));
    this.setData({
      banner: `${bannerImg}`,
      node: node,
      date: date
    })
    WxParse.wxParse('article', 'html', node.body.value, this, 5);
  }
})