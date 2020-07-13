// pages/reward/reward.js
const app = getApp();
const http = app.globalData.http;
const customBar = app.globalData.customBar;
const statusBar = app.globalData.statusBar;
const header = app.globalData.header;
import Toast from '@vant/weapp/toast/toast';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    http:http,
    toast: Toast,
    customBar: customBar,
    statusBar: statusBar,
    zanwu: http + "resource/wechat/zanwu.png",
    rewardimg: http + "resource/wechat/tuijian.png",
    data:null
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },

  
  onShareAppMessage: function () {

  },
  //预览图片
  imgsrSize(e){
    let img = e.currentTarget.dataset.img;
    wx.previewImage({
      current: img, // 当前显示图片的http链接 
      urls: [img]
    })
  },
  //返回上一页
  goBack(){
    wx.navigateBack({
      delta: 1
    })
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
      url: http + 'WxDmApill/getUsersReward',
      method: "GET",
      header: header,
      success: (d) => {
        toast.clear();
        let ires = d.data;
        if (ires.code === 200) {
          this.setData({
            data: ires.data
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