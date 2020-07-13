// pages/myEvaluation/evaluation.js
const app = getApp();
const http = app.globalData.http;
const header = app.globalData.header;

import Notify from '@vant/weapp/notify/notify';
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    http:http,
    show:"2",
    toast: Toast,
    addicon: http + "resource/wechat/xiangji.png",
    datalist:"",
    zanwu: http + "resource/wechat/zanwu.png",
    postdata:{
      'vehicle_id':'',
      'star':'',
      'text':'',
      'img':'',
      'datetime':'',
      'order_id':''
    },
    imglist: []
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
  //预览图片
  sizeImg(e){
    let index = e.currentTarget.dataset.index;
    let imgs = e.currentTarget.dataset.imgs;
    imgs = imgs.map((item) => {
      return http + item;
    })
    wx.previewImage({
      current: imgs[index], // 当前显示图片的http链接  
      urls: imgs
    })
  }, 
  //删除上传图片
  delimg(e){
    let index = e.currentTarget.dataset.index;
    //console.log(index)
    let imglist = this.data.imglist;
    let imgs=imglist.filter((item,i)=>{
      return index != item;
    })
    this.setData({
      imglist: imgs
    })
  },
  //上传图片
  setIimg() {
    let imglist =this.data.imglist;
    wx.navigateTo({
      url: "../crop/crop",
      events: {
        //获取上一页的参数
        setUserImg: (data) => {
          imglist.push(data.path);
          this.setData({
            imglist: imglist
          })
        }
      },
      success: (res) => {
        //向打开页面传递数据
        res.eventChannel.emit('setCropInfOpenerPage', {
          path:'evealuation'
        })
      }
    })
  },
  //评价提交
  sumbEvaluation(e){
    let { order, vehicle}=e.currentTarget.dataset;
    let datalist = this.data.datalist;
    let postdata = this.data.postdata;
    if (postdata.star == "") {
      Notify({ type: 'warning', background: '#EE7C35', message: '请给与评分!' });
      return false;
    }
    postdata.img = this.data.imglist.join(',');
    postdata.vehicle_id = vehicle;
    postdata.order_id = order;

    //循环获取数据
    let newdata=datalist.map((item)=>{
      if(item.id == order){
        item.estate='1';
        item.e_text = postdata.text;
        item.star = postdata.star;
        item.e_img =this.data.imglist;
      }
      return item;
    })
   
    // this.setData({
    //   datalist: newdata
    // });
    //提交成功后触发
    this.subMyEvaluation(postdata,()=>{
      // this.setData({
      //   datalist: newdata
      // });
      this.clearData(newdata);
    });
    
  },
  clearData(datalist){
    let data={
      'vehicle_id':'',
      'star': '',
      'text': '',
      'img': '',
      'datetime': '',
      'order_id': ''
    };
    this.setData({
      datalist: datalist,
      postdata: data,
      imglist:[] 
    })
  },
  //进行打分
  fengshu(e){
    let postdata = this.data.postdata;
    postdata.star = e.detail;
    this.setData({
      postdata: postdata
    })
  },
  //输入内容触发开始
  etext(e){
    let postdata = this.data.postdata;
    postdata.text=e.detail;
    this.setData({
      postdata: postdata
    })
  },
  subMyEvaluation(data,succ){
    const toast = this.data.toast.loading({
      duration: 0,       // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      message: '加载中...',
      loadingType: 'spinner',
      selector: '#load'
    });
    wx.request({
      url: http + 'WxDmApill/myEvaluation',
      method: "POST",
      data:data,
      header: header,
      success: (d) => {
        toast.clear();
        let ires = d.data;
        if (ires.code === 200) {
          Toast.fail(ires.msg);
          succ();
          // this.setData({
          //   datalist: ires.data.order
          // })
        } else {
          Toast.fail(ires.msg);
        }
      },
      fail: () => {
        console.log('请求失败');
      }
    })
  },
  //获取评级信息
  getData(){
    const toast = this.data.toast.loading({
      duration: 0,       // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      message: '加载中...',
      loadingType: 'spinner',
      selector: '#load'
    });
    wx.request({
      url: http + 'WxDmApill/getOrder',
      method: "POST",
      header: header,
      success: (d) => {
        toast.clear();
        let ires = d.data;
        if (ires.code === 200) {
          this.setData({
            datalist:ires.data.order
          })
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