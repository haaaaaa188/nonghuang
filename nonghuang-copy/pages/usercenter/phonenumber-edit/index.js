Page({
  data: {
    phoneValue: '',
  },
  onLoad(options) {
    const { name } = options;
    this.setData({
      phoneValue: name,
    });
  },
  onSubmit() {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit('updatePhone', { phoneValue: this.data.phoneValue });
    wx.navigateBack({ backRefresh: true });
  },
  clearContent() {
    this.setData({
      phoneValue: '',
    });
  },
});
