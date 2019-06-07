//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    bannerImgSrc: '/assets/images/banner-default.jpg',
    articles: [],
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
      url: 'https://api.zhaobg.com/jsonapi/node/article?fields[node--article]=title,sticky,changed,body,field_image&include=field_image&sort=-changed',
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