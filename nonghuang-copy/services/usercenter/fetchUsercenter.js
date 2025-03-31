import { config } from '../../config/index';
import { userlogin } from '../../api/index';
import { auth } from '../../common/LoginAutherize';

/** 获取个人中心信息 */
function mockFetchUserCenter() {
  const { delay } = require('../_utils/delay');
  const { genUsercenter } = require('../../model/usercenter');
  return delay(200).then(() => genUsercenter());
}

/** 获取个人中心信息 */
export function fetchUserCenter() {
  if (config.useMock) {
    return mockFetchUserCenter();
  }
  return new Promise((resolve,reject) => {
    const ans = {
      userInfo: {},
      status: 0,
      countsData: [],       // 需要补充实际数据获取逻辑
      orderTagInfos: [],    // 需要补充实际数据获取逻辑
      customerServiceInfo: {} // 需要补充实际数据获取逻辑
    };

    // if (!wx.getStorageSync('hadAuthed')) {
      wx.showModal({
        title: '温馨提示',
        content: '正在请求获取您的个人信息，以后续方便使用本程序！',
        success(res) {
          if (res.confirm) {
            // 获取用户信息
            wx.getUserProfile({
              desc: '用于完善会员信息',
              success: (res) => {
                ans.userInfo = res.userInfo;
                auth.setUserInfo(res.userInfo)
                wx.login({
                  success (res) {
                    if (res.code) {
                      //发起网络请求
                      console.log('login begin!')
                      console.log(res.code)
                      userlogin(res.code).then((status) => {
                        ans.status = status;
                      });
                      console.log('请求 success!');
                    } else {
                      console.log('登录失败！' + res.errMsg)
                    }
                  }
                })
                resolve(ans); // 所有数据就绪后resolve
              },
              fail: (err) => {
                console.error("获取用户信息失败:", err);
                reject(err);
              }
            });
          }
        }
      });
     
  });
}
