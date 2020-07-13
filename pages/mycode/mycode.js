// pages/mycode/mycode.js
const app = getApp();
const http = app.globalData.http;
const safeArea = app.globalData.safeArea;
const header = app.globalData.header;
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toast: Toast,
    safeArea: safeArea,
    mycode:null,
    isOverShare:true,
    imgoff:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userQcode = wx.getStorageSync('userQcode');
    var imgPoster = wx.getStorageSync('imgPoster');
    var imgPosters = wx.getStorageSync('imgPosters');
    if (userQcode){
      if (imgPoster && imgPoster != imgPosters) {
        this.getData();
      }else{
        this.setData({
          mycode:http+userQcode
        })
      }
    }else{
      this.getData();
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: '/pages/index/index',
      title:"我的二维码",
      imageUrl: this.data.mycode,
      success: (res) => {
        console.log("转发成功:" + JSON.stringify(res));
      }
    }
  },
  //下载我的二维码
  downloadfile(){
    let mycode = this.data.mycode;
    let toasts=this.data.toast;
    wx.getSetting({
      success(res) {
       
        if (!res.authSetting['scope.writePhotosAlbum']) {
          //console.log(res.authSetting['scope.writePhotosAlbum'])
          if (typeof res.authSetting['scope.writePhotosAlbum']==='undefined'){
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success(res) {
                Toast.success('授权成功');
                //wx.startRecord()
              }
            })
          }else{
            //Toast.success('授权成功');
            wx.openSetting({
              success(settingdata) {
                if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                  Toast.success('授权成功');
                } else {
                }
              }
            })
          }
         
        }else{
          const toast = toasts.loading({
            duration: 0,       // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            message: '下载中...',
            loadingType: 'spinner',
            selector: '#load'
          });
          wx.downloadFile({
            url: mycode,
            success:(res)=>{
              toast.clear();
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: (res) => {
                  Toast.success('保存成功');
                },
                fail:(res)=>{
                  Toast.fail('保存失败');
                }
              })
            },
            fail:(res)=>{
              Toast.fail('下载失败');
            }
          })
        } 
      }
    });

  },
  // 下载保存文件
  downLocalFile(){

  },
  //文件加载
  eventhandle(){
    this.setData({
      imgoff:true
    })
  },
  //获取我的二维码
  getData(){
    const toast=this.data.toast.loading({
      duration: 0,       // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      message: '生成中...',
      loadingType: 'spinner',
      selector: '#load'
    });
    //console.log(http)
    wx.request({
      url: http + 'WxDmApi/getQCode',
      method: "get",
      header: header,
      success: (d) => {
        toast.clear();
        let ires = d.data;
        if (ires.code === 200) {
          //Toast.success(ires.msg);
          this.setData({
            mycode: http + ires.data.src
          });
          wx.setStorageSync('imgPosters', ires.data.imgPoster); //记录个封面
          wx.setStorageSync('imgPoster', ires.data.imgPoster);
          wx.setStorageSync('userQcode', ires.data.src);
        } else {
          Toast.fail(ires.msg);
        }
      },
      fail: () => {
        console.log('请求失败');
      }
    })

  }
})