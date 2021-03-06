const ArticleService = require('../../utils/service/article.js');
const base = require('../../utils/service/base.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articles: [],
    articleType: [],
    imagesList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中..."
    })
    const type = options.type;
    const res = wx.getStorageSync('_res');
    if (res) {
      wx.hideLoading();
      this.setArticle(res, type)
    } else {
      ArticleService.getData(`${base.getApiUrl()}${base.getNodePath()}?fields[node--article]=title,field_author,field_type,field_image,changed,body&include=field_image&sort=-changed`).then(res => {
        wx.hideLoading();
        this.setArticle(res, type);

        // 缓存数据
        wx.setStorageSync('_res', res);
      }).catch(err =>{
        console.log(err);
        wx.hideLoading();
      })
    }
  },
  setArticle(res, type) {
    if (res.included) {
      let myObj = {};
      const imagesList = res.included.map(function (obj) {
        myObj[obj.id] = `${base.getApiUrl()}${obj.attributes.uri.url}`;
      })
      this.setData({
        imagesList: myObj
      })
    }

    const articles = res.data;
    articles.forEach(article => article.attributes.changed = util.formatTime(new Date(article.attributes.changed)))
    let list;

    if (type) {
      list = articles.filter(article => article.attributes.field_type.indexOf(type) > -1)
    } else {
      list = articles;
    }

    // console.log(list)
    this.setData({
      articles: list
    })
  }
})