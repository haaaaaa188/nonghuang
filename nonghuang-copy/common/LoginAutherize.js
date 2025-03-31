const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';
const USERINFO_KEY = 'current_userinfo';
const { TokenExpiresTime } = require('../config/index')

export const auth = {
  // 存储 Token
  setTokens: (token) => {
    const expiryTime = Date.now() + TokenExpiresTime * 1000;
    wx.setStorageSync(TOKEN_KEY, token);
    // wx.setStorageSync(REFRESH_TOKEN_KEY, refreshToken);
    wx.setStorageSync(TOKEN_EXPIRY_KEY, expiryTime);
  },

  // 获取当前 Token
  getToken: () => {
    const token = wx.getStorageSync(TOKEN_KEY);
    const expiry = wx.getStorageSync(TOKEN_EXPIRY_KEY);
    
    // Token 不存在或已过期
    if (!token || Date.now() >= expiry) return null;
    return token;
  },

  // 存储 UserInfo
  setUserInfo: (UserInfo) => {
    wx.setStorageSync(USERINFO_KEY, UserInfo);
  },

  // 获取当前 UserInfo
  getUserInfo: () => {
    const token = wx.getStorageSync(TOKEN_KEY);
    const expiry = wx.getStorageSync(TOKEN_EXPIRY_KEY);
    const UserInfo = wx.getStorageSync(USERINFO_KEY);
    
    if (!token || Date.now() >= expiry) return null;
    return UserInfo;
  },

  // 刷新 Token（需对接后端API）
  refreshToken: async () => {
    const refreshToken = wx.getStorageSync(REFRESH_TOKEN_KEY);
    try {
      const res = await wx.request({
        url: 'https://api.example.com/auth/refresh',
        method: 'POST',
        data: { refresh_token: refreshToken }
      });
      
      this.setTokens(
        res.data.access_token,
        res.data.refresh_token,
        res.data.expires_in
      );
      return res.data.access_token;
    } catch (err) {
      this.clearTokens();
      throw new Error('刷新 Token 失败');
    }
  },

  // 清除 Token
  clearTokens: () => {
    wx.removeStorageSync(TOKEN_KEY);
    wx.removeStorageSync(REFRESH_TOKEN_KEY);
    wx.removeStorageSync(TOKEN_EXPIRY_KEY);
  }
};