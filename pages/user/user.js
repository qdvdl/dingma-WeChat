// pages/user/user.js
const app = getApp();
const http = app.globalData.http;
const navIcon = app.globalData.navIcon;
const nav = app.globalData.nav;
const header = app.globalData.header;
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toast: Toast,
    iconList:{
      icon1: http+"resource/wechat/myicon/01.png",
      icon2: http +"resource/wechat/myicon/02.png",
      icon3: http +"resource/wechat/myicon/03.png",
      icon4: http +"resource/wechat/myicon/04.png",
      icon5: http +"resource/wechat/myicon/05.png",
      icon6: http +"resource/wechat/myicon/06.png",
      bg: http +"resource/wechat/my-img.jpg"
    },
    navIcon:navIcon,
    userinfo:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    this.data.src = currPage.data.psrc;
    //console.log(currPage.data.psrc)
    this.setData({
      src: currPage.data.psrc
    })
    //this.data.mydata = currPage.data.predata
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //每一项点击触发
  itemNav(e){
    let type=e.currentTarget.dataset.type;
    if (type==='tel'){
      wx.makePhoneCall({
        phoneNumber: this.data.userinfo.phoneTel
      })
    }else{
      //跳转到指定页面
      wx.navigateTo({
        url: '../' + type,
      })
    }
   
  },
  //设置用户信息页面
  setinfo(){
    wx.navigateTo({
      url:"../userinfo/userinfo",
      events:{
        //获取上一页的参数
        setDataFromOpenedPage:(data)=>{
          let info=this.data.userinfo;
          info.nickname = data.nickname;
          info.headimg = data.headimg;
          this.setData({
            userinfo: info
          })
        }
      },
      success:(res)=>{
        //向打开页面传递数据
        res.eventChannel.emit('userInfOpenerPage', {
          headimg: this.data.userinfo.headimg,
          nickname: this.data.userinfo.nickname
        })
      }
    })
  },
  //去上传头像
  resetimg(){
    wx.navigateTo({
      url: '../test/test',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        },
        someEvent: function (data) {
          console.log(data)
        }
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        // res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
      }
    })
  },
  //获取数据
  getData(){
    const toast = this.data.toast.loading({
      duration: 0,       // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      message: '加载中...',
      loadingType: 'spinner',
      selector: '#load'
    });
    wx.request({
      url: http + 'WxDmApill/getUserInfo',
      method: "GET",
      header: header,
      success: (d) => {
        toast.clear();
        let ires = d.data;
        if (ires.code === 200) {
          this.setData({
            userinfo: ires.data
          })
          //f(ires.data.data)
        } else {
          console.log('请求错误');
        }
      },
      fail: () => {
        console.log('请求失败');
      }
    })
  },
  //底部导航跳转
  tonavlist(e) {
    nav(e.detail)
  }
})