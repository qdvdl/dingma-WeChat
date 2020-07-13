// pages/article/index.js
const app = getApp();
const http = app.globalData.http;
const header = app.globalData.header;
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toast: Toast,
    siteinfo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //获取文章信息
  getData(){

    const toast = this.data.toast.loading({
      duration: 0,       // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      message: '加载中...',
      loadingType: 'spinner',
      selector: '#load'
    });
    wx.request({
      url: http + 'WxDmApill/getSiteInfo',
      method: "GET",
      header: header,
      success: (d) => {
        toast.clear();
        let ires = d.data;
        if (ires.code === 200) {
          this.setData({
            siteinfo: ires.data.siteinfo,
          })
          console.log(ires)
        } else {
          console.log('请求错误');
        }
      },
      fail: () => {
        console.log('请求失败');
      }
    })
  }
})