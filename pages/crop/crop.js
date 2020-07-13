// pages/test/test.js
const app = getApp();
const http = app.globalData.http;
const header = app.globalData.header;
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pshowimg: false,
    offsheet: false,
    src: '',
    psrc: '',
    width: 200,//宽度
    height: 200,//高度
    angle: 0,
    scale: 1,
    toast: Toast,
    path:"users"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    this.cropper = this.selectComponent("#image-cropper");
    
    eventChannel.on('setCropInfOpenerPage', (data) => {
      this.setData({
        path: data.path,
      })
    })
    //this.cropper.imgReset();
   
  },
  //确认上传图片
  pimgConfirm() {
    const eventChannel = this.getOpenerEventChannel();
    const toast = this.data.toast.loading({
      duration: 0,       // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      message: '上传中...',
      loadingType: 'spinner',
      selector: '#load'
    });
    //向返回页面传递参数
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];

    //console.log(prevPage)
    wx.uploadFile({
      url: http+'wxDmApi/upload',
      filePath: this.data.psrc,
      name: 'file',
      formData: {
        path: this.data.path
      },
      header: header,
      success(res) {
        toast.clear();
        let ires = JSON.parse(res.data);
        //console.log(ires)
        if (ires.code == 200) {
          eventChannel.emit('setUserImg',ires.data);
          wx.navigateBack({delta: 1})
        }

      }
    })
  },
  //开始裁剪
  cropperImg() {
    this.cropper.pushImg(this.data.src);

    this.cropper.getImg((d) => {
      this.setData({
        psrc: d.url,
        pshowimg: true
      })
      //console.log(url)
    })

  },
  //设置img
  setimg(e) {
    let type = e.target.dataset.type;
    let sets = e.target.dataset.sets;
    if (type === 'angle') {
      this.setData({
        angle: this.data.angle + 90
      })
    }
    if (type === 'scale') {

      let scale
      if (sets == 'sx') {
        scale = this.data.scale - 0.5;

      }
      if (sets == 'fd') {

        scale = this.data.scale + 0.5;
      }

      if (parseInt(scale) < 1) {
        scale = 1;
      }
      if (parseInt(scale) >= 3) {
        scale = 3;
      }

      this.setData({
        scale: scale
      })
    }

  },
  //添加文件
  addfile(e) {
    let type = e.target.dataset.type;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths[0];
        this.setData({
          src: tempFilePaths,
          offsheet: false,
          angle: 0,
          scale: 1
        })

      }
    })
  },
  shofiel() {
    this.setData({
      'offsheet': true
    })
  },
  //取消选择
  oncancel() {
    this.setData({
      'offsheet': false
    })
  },
  //图片加载完毕
  loadimage() {
    wx.hideLoading();
    //重置图片角度、缩放、位置
    this.cropper.imgReset();
  },

})