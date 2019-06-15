//index.js
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
  },

  getArticles(callBack) {
    wx.request({
      url: 'https://api.zhaobg.com/jsonapi/node/article?include=field_image&sort=-changed',
      header: {
        Accept: 'application/vnd.api+json'
      },
      success: (res) => {
        const articles = res.data.data;
        console.log(articles)
        
        // get images
        console.log(res)
        if(res.data.included){
          let myObj = {};
          const imagesList = res.data.included.map(function(obj){
            myObj[obj.id]=`https://api.zhaobg.com${obj.attributes.uri.url}`;
          })
          this.setData({
            imagesList: myObj
          })
          console.log(this.data.imagesList)
        }
        this.setData({
          articles: articles,
          loading: false
        });
        this.setStiky();
        this.setArticleType();
      },
      fail: err =>{
        console.log('Api fetch fail!')
      },
      complete: ()=>{
        callBack && callBack();
      }
    })
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
    console.log(stikyArticles);
    const date = new Date(stikyArticles[0].attributes.changed);
    this.setData({
      stiky: stikyArticles[0],
      stikyDate: `${date.getUTCHours()}:${date.getMinutes()}`
    })
  },

  onTabType(event){
    const type = event.currentTarget.dataset.type;
    console.log(event)
    wx.navigateTo({
      url: `/pages/list/list?type=${type}`
    })
  },

  onTabNode(event){
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/node/node?id=${id}`
    })
  }
})