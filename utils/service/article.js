const getData = (url, callBack) => {
  return new Promise(function(resolve, reject){
    wx.request({
      url: url,
      header: {
        Accept: 'application/vnd.api+json'
      },
      success: (res) => {
        const data = res.data;
        resolve(data)
      },
      fail: err => {
        console.log('Api fetch fail!')
      },
      complete: () => {
        callBack && callBack();
      }
    })
  })
}

const api = 'https://api.zhaobg.com';

module.exports = {
  getData: getData,
  api: api
}