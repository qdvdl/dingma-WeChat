//index.js
//获取应用实例
const app = getApp();
const navIcon = app.globalData.navIcon;
const http = app.globalData.http;
const header = app.globalData.header;
const nav = app.globalData.nav;
// console.log(app)
import Toast from '@vant/weapp/toast/toast';

Page({
  data: {
    zanwu: http + "resource/wechat/zanwu.png",
    isauth:true,
    navIcon: navIcon,
    // 滚动
    http: http,
    banner:[],
    circular:true,
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 500,
    // end滚动
    isTel:false,
    cookie:'',
    msg:'',
    toast: Toast,
    src:"",
    thistoast:null,
    vehicle_head:null, //推荐
    vehicle_home:null,  //首付
    info:[],         //成交信息
    uid:null
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (o) {
    if (o.uid){
      let uid = wx.getStorageSync('uid');
      //获取uid
      if(!uid){
        wx.setStorageSync('uid',o.uid);
        //this.uid = o.uid;
      }
    }
    let token=wx.getStorageSync('token');
    //let isTel=wx.getStorageSync('isTel');
    
    if (token){
      this.setData({
        isauth: false
      }) 
     
    }else{
      this.setData({
        isauth: true
      }) 
    
    }
    setTimeout(()=>{
      this.getData(); 
    },300)

  },
  onShow(){
    // let token = wx.getStorageSync('token');
    // if (token) {
    //   this.setData({
    //     isauth: false
    //   })
    // } else {
    //   this.setData({
    //     isauth: true
    //   })
    // }

  },
  //分享
  onShareAppMessage: function (ops) {
   
  },
  onReady: function () {
    //console.log(11)
   
    //this.data.thistoast.clear();
  },
  //获取banner
  bannerContent(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../banner/index?id=" + id
    })
  },
  //去详情
  details(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../details/details?id=" + id
    })
  },
  //个人中心
  touser(){
    wx.navigateTo({
      url:"../user/user"
    })
  },
  //去搜索页面
  searchBtn(e){
    let path = e.currentTarget.dataset.path;
    wx.navigateTo({
      url: "../" + path
    })
  },
  //用户验证通过
  isAllow(){
    //验证通过后的全部业务逻辑
    this.setData({
      isauth:false
    })
  },
  //登录授权用户信息
  loginClick(res){
    var token = wx.getStorageSync('token');
    var isTel = wx.getStorageSync('isTel');
    if (token&&isTel=='ok'){
      this.isAllow();
      //wx.clearStorageSync()
    }else{
      let ires = res.detail;
      if (ires.errMsg === 'getUserInfo:ok') {
        //console.log(res);
        this.userLogin(ires.userInfo);
      }
    }
  },
  //获取用户信息code获取token
  userLogin(info){
    const toast = this.data.toast.loading({
      duration: 0,       // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      message: '加载中...',
      loadingType: 'spinner',
      selector: '#load'
    });
    wx.login({
     success:res=>{
       if(res.code){
         wx.request({
           url: http +'wxDmApi/login',
           data: {
             nickname:info.nickName,
             headimg:info.avatarUrl,
             code: res.code
           },
           method:"POST",
           header: {
             'content-type': 'application/x-www-form-urlencoded' // 默认值
           },
           success:(d)=>{
             toast.clear();
             let ires=d.data;
             if (ires.code===200){
               
              //手机号是否授权
              if (ires.data.isTel === 'no'){
                this.setData({
                   isTel:true,
                   cookie: d.header['Set-Cookie']
                })
              }else{
                this.isAllow();
              }
              // console.log(ires.data.isTel)
               app.globalData.header.token = ires.data.token;
              wx.setStorageSync('token', ires.data.token);
              wx.setStorageSync('isTel', ires.data.isTel);
             
             }else{
               console.log(ires.msg)
             }
           },
           fail:()=>{
             toast.clear();
             console.log('请求失败');
           }
         })

       }else{
         console.log('登录失败！' + res.errMsg)
       }
     }
    })
  },
  //暂时不绑定手机号
  notel(){
    this.setData({
      isTel: false
    })
  },
  //获取手机号
  getPhoneNumber(res){
    var token = wx.getStorageSync('token');
    let uid = wx.getStorageSync('uid');
    this.notel();
    let isres = res.detail;
    if (isres.errMsg =='getPhoneNumber:ok'){
        let data={
          encryptedData: isres.encryptedData,
          iv: isres.iv,
          uid: uid
        }
      const toast = this.data.toast.loading({
        duration: 0,       // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        message: '加载中...',
        loadingType: 'spinner',
        selector: '#load'
      });
        wx.request({
          url: http+'wxDmApi/getPhoneNumber',
          data: data,
          method: "POST",
          header: {
            'token': token,
            'Cookie':this.data.cookie,
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: (d) => {
            toast.clear();
            let ires = d.data;
            if (ires.code === 40002) {
              wx.setStorageSync('isTel', 'ok'); 
              this.isAllow();
            }
          },
          fail: () => {
            console.log('请求失败');
          }
        })
     
    }
  },
  //获取首页数据
  getData(){
    //var token = wx.getStorageSync('token');
    //console.log(1+token);
    // const toast = this.data.toast.loading({
    //   duration: 0,       // 持续展示 toast
    //   forbidClick: true, // 禁用背景点击
    //   message: '加载中...',
    //   loadingType: 'spinner',
    //   selector: '#load'
    // });
    //console.log(http)
    wx.request({
      url: http + 'WxDmApill/getHome',
      data:{},
      method: "POST",
      header:header,
      success:(d) => {
        //console.log(d)
        //toast.clear();
        let ires = d.data;
       
        if(ires.code === 200) {
         this.setData({
           vehicle_head: ires.data.vehicle_head,
           vehicle_home: ires.data.vehicle_home,
           banner: ires.data.banner,
           info:ires.data.info
         })
        }else{
          console.log('请求错误');
        }
      },
      fail: () => {
        console.log('请求失败');
      }
    })
  },
  goVehicle(){
    console.log(11)
    wx.reLaunch({
      url: '../choice/choice'
    })

  },
  //更多车辆跳转
  moreChoice(){
    wx.reLaunch({
      url: '../choice/choice'
    })
  },
  //底部跳转
  tonavlist(e){
   
    nav(e.detail)
  }
})
