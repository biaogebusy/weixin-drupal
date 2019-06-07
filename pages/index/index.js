//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    bannerImgSrc: '/assets/images/banner-default.jpg',
    articles: [],
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
      url: 'https://api.zhaobg.com/jsonapi/node/article',
      header: {
        Accept: 'application/vnd.api+json'
      },
      success: (res) => {
        const articles = res.data.data;
        console.log(articles)
        this.setData({
          articles: articles,
          loading: false
        });
        this.getStiky();
      },
      fail: err =>{
        console.log('Api fetch fail!')
      },
      complete: ()=>{
        callBack && callBack();
      }
    })
  },

  getStiky(){
    const stikyArticles = this.data.articles.filter(item => item.attributes.sticky === true);
    console.log(stikyArticles);
    const date = new Date(stikyArticles[0].attributes.changed);
    this.setData({
      stiky: stikyArticles[0],
      stikyDate: `${date.getUTCHours()}:${date.getMinutes()}`
    })
  },

  onTabNode(event){
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/node/node?id=${id}`,
    })
  }
})