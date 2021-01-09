const apiUrl = 'https://api.zhaobg.com';
const nodePath = '/jsonapi/node/article';

module.exports = {
  getApiUrl(){
    return apiUrl;
  },
  getNodePath(){
    return nodePath;
  }
}