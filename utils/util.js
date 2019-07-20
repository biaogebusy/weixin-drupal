module.exports = {

  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
  },

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  },

  onTabNode(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/node/node?id=${id}`
    })
  },

  getUserInfo() {
    return new Promise((resolve, reject) => {
      this.isAuthenticated().then(() => {
        wx.getUserInfo({
          success(res) {
            const userInfo = res.userInfo;
            resolve(userInfo)
          }
        })
      }).catch(() => {
        reject()
      })
    })
  },

  isAuthenticated() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo'] === true) {
            resolve()
          } else {
            reject()
          }
        }
      })
    })
  }
}