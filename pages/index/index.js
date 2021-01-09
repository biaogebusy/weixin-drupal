const ArticleService = require('../../utils/service/article.js');
const base = require('../../utils/service/base.js');
const util = require('../../utils/util.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    bannerImgSrc: '/assets/images/banner-default.jpg',
    articles: [],
    articleType: [],
    imagesList: [],
    stiky: {},
    stikyDate: ''
  },

  onPullDownRefresh() {
    this.getArticles(() => {
      wx.stopPullDownRefresh();
    })
  },

  onLoad() {
    this.getArticles();
  },

  getArticles(callBack) {
    wx.showLoading({
      title: "加载中..."
    })
    const res = wx.getStorageSync('_res');
    if (res) {
      wx.hideLoading();
      this.setArticle(res)
    } else {
      ArticleService.getData(`${base.getApiUrl()}${base.getNodePath()}?fields[node--article]=title,field_author,field_type,field_image,sticky,changed,body&include=field_image&sort=-changed`, callBack).then(res => {
        wx.hideLoading();
        this.setArticle(res);
        // 缓存数据
        wx.setStorageSync('_res', res);
      }).catch(err =>{
        console.log(err);
        wx.hideLoading();
      })
    }
  },

  setArticle(res) {
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
    console.log(articles)
    articles.forEach(article => article.attributes.changed = util.formatTime(new Date(article.attributes.changed)))
    this.setData({
      articles: articles,
    });
    this.setStiky();
    this.setArticleType();
  },

  setArticleType() {
    const articleType = [];
    this.data.articles.forEach(function (article) {
      const types = article.attributes.field_type;
      if (types.length > 0) {
        types.forEach(function (type) {
          if (articleType.indexOf(type) == -1) {
            articleType.push(type)
          }
        })
      }
    })
    this.setData({
      articleType: articleType
    })
  },

  setStiky() {
    const stikyArticles = this.data.articles.filter(item => item.attributes.sticky === true);
    console.log(stikyArticles)
    var randomArticle = stikyArticles[util.getRandomInt(5)];
    console.log(randomArticle)
    const date = new Date(randomArticle.attributes.changed);
    this.setData({
      stiky: randomArticle,
      stikyDate: `${date.getUTCHours()}:${date.getMinutes()}`
    })
  },

  onTabType(event) {
    const type = event.currentTarget.dataset.type;
    if (type === 'All') {
      wx.navigateTo({
        url: '/pages/index/index'
      })
    } else {
      wx.navigateTo({
        url: `/pages/list/list?type=${type}`
      })
    }
  },

  onTabNode(event) {
    util.onTabNode(event)
  }
})