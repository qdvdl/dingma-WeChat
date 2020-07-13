// pages/choice/choice.js
const app = getApp();
const http = app.globalData.http;
const navIcon = app.globalData.navIcon;
const header = app.globalData.header;
const safeArea = app.globalData.safeArea;
const nav = app.globalData.nav;
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    http:http,
    h:'70vh',
    navIcon:navIcon,
    fiterShow:false,
    zanwu: http + "resource/wechat/zanwu.png",
    sxicon: http +"resource/wechat/shaixuan.png",
    searchValue:"",
    columns:[
      { text: '全部商品', value: 0 },
      { text: '新款商品', value: 1 },
      { text: '活动商品', value: 2 }
    ],
    toast: Toast,
    // 数据
    dataList:null,
    brand:[],
    //分页
    parameter:{
      brand:"",
      page: 1,
      limit: 10,
      orderby: "fprice_ASC",//fprice,mprice
      name: "",
      show: "more"//more:更多，,hide//结束
    },
    //筛选
    fiter_type:"fiter1",
    fiterOff:true,
    fiterList:"",
    sxname:"",
    sxbrand:"筛选"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (safeArea >=768){
      this.setData({
        h:"75vh"
      })
    }
    //首页加载获取数据默认数据
    this.getData(this.data.parameter,(data)=>{
      this.setData({
        dataList: data
      })
    });
   // console.log(safeArea)
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
   
    // this.getData(this.data.parameter, (data) => {
    //   this.setData({
    //     dataList: data
    //   })
    //   wx.stopPullDownRefresh();
    // });
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //去详情
  details(e){
    let id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../details/details?id=" + id
    })
  },
  //输入内容触发时间
  onSearchChange(e){
    let param = this.data.parameter;
    param.name = e.detail;
    this.setData({
      parameter: param
    })
  },
  //点击搜索
  onSearch(){
    let param = this.data.parameter;
    param.page = 1;
    //console.log(param)
    this.getData(param, (res) => {
      if (res.length >= param.limit) {
        param.show = 'more'
      } else if (res.length < param.limit) {
        param.show = 'hide'
      }
      this.setData({
        parameter: param,
        dataList: res
      })
    });
  },
  //筛选
  fiter(e){
    let type = e.target.dataset.type;
    let param = this.data.parameter;

    if (type==='brand'){
      this.setData({
        fiterShow:true
      })
    }else{
      //orderby: "fprice_ASC",//fprice,mprice
      
      if (this.data.fiter_type == type){
        this.setData({
          fiter_type: type,
          fiterOff: !this.data.fiterOff
        })
      }else{
        this.setData({
          fiter_type: type,
          fiterOff: true
        })
      }   

      if (type == "fiter1") {
        param.orderby = this.data.fiterOff ? 'fprice_ASC' : 'fprice_DESC';
      }

      if (type == "fiter2") {
        param.orderby = this.data.fiterOff ? 'mprice_ASC' : 'mprice_DESC';
      }
      param.page=1;
      this.getData(param, (res) => {
        if (res.length >= param.limit) {
          param.show = 'more'
        } else if (res.length < param.limit) {
          param.show = 'hide'
        } 
        this.setData({
          parameter: param,
          dataList: res
        })
      });

    }
   
  },
  //筛选品牌后
  fiterList(e){
    this.setData({
      sxname: e.target.dataset.name,
      fiterList: e.target.dataset.id
    })
  },
  //确认筛选品牌
  fiterHides(){
    let param = this.data.parameter;
    param.brand = this.data.fiterList;
    //console.log(param)
    param.page = 1;
    this.getData(param, (res) => {
      if (res.length >= param.limit) {
        param.show = 'more'
      } else if (res.length < param.limit) {
        param.show = 'hide'
      }
      this.setData({
        sxbrand: this.data.sxname,
        fiterShow: false,
        parameter: param,
        dataList: res
      })
    });

  },
  //选择弹窗关闭
  fiterHide(){
    this.setData({
      fiterShow: false
    })
  },
  //清空筛选
  fiterClear(){
    let param = this.data.parameter;
    param.page=1;
    param.brand="";
    this.getData(param, (res) => {
      if (res.length >= param.limit) {
        param.show = 'more'
      } else if (res.length < param.limit) {
        param.show = 'hide'
      }
      this.setData({
        parameter: param,
        dataList: res,
        fiterList:"",
        fiterShow:false,
        sxbrand:'筛选'
      })
    });

    
  },
  //清空搜索
  onClear(){

    let param = this.data.parameter;
    param.page = 1;
    param.name = "";
    this.getData(param, (res) => {
      if (res.length >= param.limit) {
        param.show = 'more'
      } else if (res.length < param.limit) {
        param.show = 'hide'
      }
      this.setData({
        parameter: param,
        dataList: res,
        fiterShow: false
      })
    });
  },
  //获取更多数据
  moreGetData(){
    let param=this.data.parameter;
    param.page = param.page+1;
    
    this.getData(param,(res)=>{
      if (res.length >= param.limit){
        param.show ='more'
      } else if (res.length < param.limit){
        param.show = 'hide'
      }
      for(let i=0;i<res.length;i++){
        this.data.dataList.push(res[i]);
      }
      this.setData({
        parameter: param,
        dataList:this.data.dataList
      })
    })
   
  },
  //获取数据
  getData(data,f){
    const toast = this.data.toast.loading({
      duration: 0,       // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      message: '加载中...',
      loadingType: 'spinner',
      selector: '#load'
    });
    wx.request({
      url: http + 'WxDmApill/getVehicle',
      data: data,
      method: "GET",
      header: header,
      success: (d) => {
        toast.clear();
        let ires = d.data;
        console.log(ires)
        if (ires.code === 200) {
          this.setData({
            brand:ires.data.brand
          })
          f(ires.data.data);
          //this.setData({
            //dataList: ires.data.data
            // vehicle_head: ires.data.vehicle_head,
            // vehicle_home: ires.data.vehicle_home,
            // banner: ires.data.banner,
            // info: ires.data.info
          //})
        } else {
          console.log('请求错误');
        }
      },
      fail: () => {
        console.log('请求失败');
      }
    })
  },
  tonavlist(e) {
    nav(e.detail)
  }
})