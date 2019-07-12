const ArticleService = require('../../utils/service/article.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    bannerImgSrc: '/assets/images/banner-default.jpg',
    articles: [],
    articleType:[],
    imagesList: [],
    loading: true,
    stiky: {},
    stikyDate: ''
  },

  onPullDownRefresh(){
    this.getArticles(()=>{
      wx.stopPullDownRefresh();
    })
  },

  onLoad() {
    this.getArticles();

    const res = wx.getStorageSync('_res');
    if (res) {
      this.setArticle(res)
    } else {
      ArticleService.getData('https://api.zhaobg.com/jsonapi/node/article?fields[node--article]=title,field_author,field_type,field_image,changed,body&include=field_image&sort=-changed').then(res => {
        console.log(res)
        this.setArticle(res);

        // 缓存数据
        wx.setStorageSync('_res', res);
      })
    }
  },

  getArticles(callBack) {
    ArticleService.getData('https://api.zhaobg.com/jsonapi/node/article?fields[node--article]=title,field_author,field_type,field_image,sticky,changed,body&include=field_image&sort=-changed', callBack).then(res => {
      this.setArticle(res);
      // 缓存数据
      wx.setStorageSync('_res', res);
    });
  },

  setArticle(res){
    if (res.included) {
      let myObj = {};
      const imagesList = res.included.map(function (obj) {
        myObj[obj.id] = `https://api.zhaobg.com${obj.attributes.uri.url}`;
      })
      this.setData({
        imagesList: myObj
      })
    }
    const articles = res.data;
    this.setData({
      articles: articles,
      loading: false
    });
    this.setStiky();
    this.setArticleType();
  },
 
  setArticleType(){
    const articleType = [];
    this.data.articles.forEach(function(article){
      const types =  article.attributes.field_type;
      if (types.length > 0){
        types.forEach(function(type){
          if (articleType.indexOf(type) == -1){
            articleType.push(type)
          }
        })
      }
    })
    this.setData({
      articleType: articleType
    })
  },

  setStiky(){
    const stikyArticles = this.data.articles.filter(item => item.attributes.sticky === true);
    const date = new Date(stikyArticles[0].attributes.changed);
    this.setData({
      stiky: stikyArticles[0],
      stikyDate: `${date.getUTCHours()}:${date.getMinutes()}`
    })
  },

  onTabType(event){
    const type = event.currentTarget.dataset.type;
    if (type === 'All'){
      wx.navigateTo({
        url: '/pages/index/index'
      })
    }else{
      wx.navigateTo({
        url: `/pages/list/list?type=${type}`
      })
    }
  },

  onTabNode(event){
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/node/node?id=${id}`
    })
  }
})