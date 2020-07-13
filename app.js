//app.js
App({
 
  onLaunch: function () {
    wx.getSystemInfo({
      success: e => {
      //console.log(e)
        this.globalData.statusBar = e.statusBarHeight; //状态栏高度
        let custom = wx.getMenuButtonBoundingClientRect();//菜单按钮
        this.globalData.custom = custom;
        this.globalData.customBar = custom.bottom + custom.top - e.statusBarHeight;
        this.globalData.safeArea = e.safeArea.height;
      }
    })

    var token = wx.getStorageSync('token');
    this.globalData.token = token;
    this.globalData.header.token = token;
    //console.log(token)
    this.userVerification(token);
    this.overShare();

  },
  getUpdateData(f){
    let share = null;

    this.getSiteInfo((d) => {
      // console.log(d)
      share = d;
      f(share)
      //获取是否有封面图片
      var imgPoster = wx.getStorageSync('imgPoster');
      if (imgPoster) {
        wx.setStorageSync('imgPoster', d.imgPoster);
      } else {
        wx.setStorageSync('imgPoster', d.imgPoster);
        wx.setStorageSync('imgPosters', d.imgPoster); //记录个封面
      }
    })
  },
  //设置全局分享
  overShare(){
    
    //this.getSiteInfo();
    wx.onAppRoute((res)=>{
      let pages = getCurrentPages(),
      view = pages[pages.length - 1],data;
      if (view){
        data = view.data; 
        //是否设置全局分享页面
        if (!data.isOverShare){
          //console.log(share)
          this.getUpdateData((share)=>{
            view.onShareAppMessage = () => {
              //分享配置
              return {
                title: share.shareName, // 子页面的title
                imageUrl: this.globalData.http + share.shareImgurl,
                path: '/pages/index/index'
              };
            }
          })
          
        } 
      }
      
    })
  },
  //获取网站信息
  getSiteInfo(succ){
    wx.request({
      url: this.globalData.http + 'wxDmApi/getSiteInfo',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: (d) => {
        let ires = d.data;
        if (ires.code===200){
          succ(ires.data)
        }
      },
      fail: () => {
        console.log('请求失败');
      }
    })
  },
  //验证用户是否失效
  userVerification(token){
    wx.request({
      url: this.globalData.http + 'wxDmApi/userVerification',
      method: "POST",
      header: {
        'token': token,
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: (d) => {
        //console.log(d)
        let ires = d.data;
      
        if (ires){
        
          if (ires.code===40001){
            try {
              wx.removeStorageSync('token');
              wx.removeStorageSync('isTel');
            } catch (e) {
              console.log('清除token错误')
            }
          }
        }else{
          wx.removeStorageSync('token');
          wx.removeStorageSync('isTel');
        }
      },
      fail: () => {
        console.log('请求失败');
      }
    })

  },
  globalData: {
    nav:function(name){
    
      wx.reLaunch({
        url: '../' + name
      })
    },
    userInfo: null,
    http:"https://www.tfxyc.com/",
    header:{
      'token':"",
      'auth': 'dingma',
      'content-type': 'application/x-www-form-urlencoded' 
    },
    //底部导航共图片
    navIcon:{
      home:"https://www.tfxyc.com/resource/wechat/home.png",
      homeActive:"https://www.tfxyc.com/resource/wechat/home-active.png",
      my: "https://www.tfxyc.com/resource/wechat/my.png",
      myActive: "https://www.tfxyc.com/resource/wechat/my-active.png",
      ss: "https://www.tfxyc.com/resource/wechat/ss.png",
      ssActive: "https://www.tfxyc.com/resource/wechat/ss-active.png",
    }
  }
})