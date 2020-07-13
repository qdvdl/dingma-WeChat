// pages/userinfo/userinfo.js
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
    setshow:false,
    useinfo:null,
    nickname:"",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    const eventChannel = this.getOpenerEventChannel();
    //向上一页传递数据
    // eventChannel.emit('acceptDataFromOpenedPage', { data: 'test' });
    // eventChannel.emit('someEvent', { data: 'test' });
    //接受传递数据
    eventChannel.on('userInfOpenerPage',(data)=>{
      this.setData({
        useinfo:data,
        nickname:data.nickname
      })
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //设置头像
  setIimg(){
    const eventChannel = this.getOpenerEventChannel();
    wx.navigateTo({
      url: "../crop/crop",
      events: {
        //获取上一页的参数
        setUserImg: (data) => {
          let useinfo = this.data.useinfo; 
          useinfo.headimg = http + data.path;
          this.setUserInfo({ headimg: http+data.path }, () => {
            //提交成功处理成功弹出
            this.setData({
              useinfo: useinfo
            })
            eventChannel.emit('setDataFromOpenedPage', useinfo);
          });
        }
      }
    })
  },
  //监听昵称
  setnickname(){
    this.setData({
      setshow:true,
    })
  },
  //输入数据
  onChange(e){
    this.setData({
      nickname: e.detail
    })
  },
  //提交信息
  submit(){
    const eventChannel = this.getOpenerEventChannel();
    let nickname = this.data.nickname;
    let useinfo = this.data.useinfo;
    useinfo.nickname = nickname;
    this.setUserInfo({ nickname: nickname},()=>{
      //提交成功处理成功弹出
      this.setData({
        useinfo: useinfo
      }) 
      eventChannel.emit('setDataFromOpenedPage', useinfo);
    });
  },
  setUserInfo(data, succ){
    const toast = this.data.toast.loading({
      duration: 0,       // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      message: '加载中...',
      loadingType: 'spinner',
      selector: '#load'
    });
    wx.request({
      url: http + 'WxDmApill/setUserInfo',
      method: "POST",
      data:data,
      header: header,
      success: (d) => {
        toast.clear();
        let ires = d.data;
        if (ires.code === 200) {
          succ()
          Toast.success(ires.msg);
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