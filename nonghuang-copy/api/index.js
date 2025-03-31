const { baseApiUrl } = require('../config/index')
const { auth } = require('../common/LoginAutherize')

export const userlogin = code => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseApiUrl}/user/login`,
      method: 'POST',
      data: {
        code
      },
      success (res) {
        console.log(res.data)
        console.log(res.data.status)
        auth.setTokens(res.data.data.token)
        resolve(res.data.status)
      },
      fail: (err) => {
        reject(err); 
      }
    });
  });
};
