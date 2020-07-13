// pages/mycar/mycar.js
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
    bg: http +"resource/wechat/mycl.jpg",
    zanwu: http + "resource/wechat/zanwu.png",
    order:null,
    contmoney:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  onShareAppMessage: function () {

  },
  //获取数据
  getData() {
    const toast = this.data.toast.loading({
      duration: 0,       // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      message: '加载中...',
      loadingType: 'spinner',
      selector: '#load'
    });
    wx.request({
      url: http + 'WxDmApill/getUserOrder',
      method: "GET",
      header: header,
      success: (d) => {
        toast.clear();
        let ires = d.data;
        if (ires.code === 200) {
          this.setData({
            order: ires.data.order,
            contmoney: ires.data.contmoney
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