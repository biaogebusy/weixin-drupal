const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function onTabNode(event) {
  const id = event.currentTarget.dataset.id;
  wx.navigateTo({
    url: `/pages/node/node?id=${id}`
  })
}

module.exports = {
  formatTime,
  getRandomInt,
  onTabNode
}