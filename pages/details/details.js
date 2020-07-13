// pages/details/details.js
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
    isOverShare:true,
    http:http,
    zanwu: http + "resource/wechat/zanwu.png",
    toast: Toast,
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 500,
    bindex:1,
    icon:{
      wen: http +"resource/wechat/wen.png",
      zhuanfa: http + "resource/wechat/zhuanfa.png"
    },
    //咨询价格弹窗
    askingshow:false,
    //咨询价格弹窗
    okShow: false,
    //详情数据
    details:null,
    //提交数据
    postdata:{
      user_id:"",
      vehicle_id:"",
      client_tel:"",
      client_name:"",
      submit_time:"",
      budget:""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id= options.id;
    // let id = 15;
    this.getData(id);
   
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    return {
      title: this.data.details.title,
      path: "pages/index/index?uid=" + this.data.details.user.id,
      imageUrl:http+this.data.details.banner[0],
      success:(res)=>{
        console.log("转发成功:" + JSON.stringify(res));
      }
    }
  },
  //输入表单开始
  onChange(e){
    let type = e.currentTarget.dataset.field;
    let postdata = this.data.postdata;
    postdata[type] = e.detail;
    this.setData({
      postdata: postdata
    })
  },
  //询问价格
  askingPrice(e){
    let postdata = this.data.postdata;
    let type = e.currentTarget.dataset.type;
    let details = this.data.details;
    if (type ==='submit'){
      let regExp = /[^\u4E00-\u9FA5]/g;//姓名
      let tel = /^1[3456789]\d{9}$/; //手机
      let amount = /^\d+(\.\d{1,2})?$/; //金额

      if (postdata.client_name==""){
        Notify({ type: 'warning', background:'#EE7C35', message: '请输入姓名!' });
        return false;
      }
      if (postdata.client_tel == "") {
        Notify({ type: 'warning', background: '#EE7C35', message: '请输入手机号码!' });
        return false;
      }
      if (postdata.budget == "") {
        Notify({ type: 'warning', background: '#EE7C35', message: '请输入购车预算!' });
        return false;
      }

      if (regExp.test(postdata.client_name)) {
        Notify({ type: 'warning', background: '#EE7C35', message: '姓名格式错误，必须是中文!' });
        return false;
      }

      if(!tel.test(postdata.client_tel)) {
        Notify({ type: 'warning', background: '#EE7C35', message: '请输入正确的手机号!' });
        return false;
      }

      if (!amount.test(postdata.budget)) {
        Notify({ type: 'warning', background: '#EE7C35', message: '金额格式错误，数字保留两位小数!' });
        return false;
      }
      this.postData(postdata,()=>{
        this.setData({
          okShow: true,
          askingshow: false,
        })
      });
     // console.log(postdata)
    }else{
      postdata.user_id = details.user.id;
      postdata.vehicle_id = details.id;
      postdata.client_tel = details.user.tel;

      postdata.client_name="";
      postdata.budget="";
      //console.log(postdata)
      this.setData({
        askingshow: true,
        postdata: postdata
      })
      //console.log(this.data.postdata)
    }
 
  },
  //去更多评价
  evaluation(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../evaluation/evaluation?id=" + id
    })

  },
  // 提交询价
  postData(data,succ){
    const toast = this.data.toast.loading({
      duration: 0,       // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      message: '加载中...',
      loadingType: 'spinner',
      selector: '#load'
    });
    wx.request({
      url: http + 'WxDmApill/setClient',
      data: data,
      method: "POST",
      header: header,
      success: (d) => {
        toast.clear();
        let ires = d.data;
        if (ires.code === 200) {
            
            succ()
            setTimeout(()=>{
              this.setData({
                okShow: false,
              })
            },3000)
        } else {
          console.log('请求错误');
        }
      },
      fail: () => {
        console.log('请求失败');
      }
    })
  },
  //拨打电话
  wenwen(){
    wx.makePhoneCall({
      phoneNumber: this.data.details.siteinfo.phoneTel
    })
  },
  // banner计数
  eventhandle(e){
    this.setData({
      bindex: e.detail.current+1
    })
  },
  //获取详情大图
  imgsrc(e){
    let index = e.currentTarget.dataset.index;
    let imgs=this.data.details.evaluation.img;
    imgs=imgs.map((item)=>{
      return http+item; 
    })
    wx.previewImage({
      current: imgs[index], // 当前显示图片的http链接  
      urls: imgs
    })
  },
  //获取数据
  getData(id){
    const toast = this.data.toast.loading({
      duration: 0,       // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      message: '加载中...',
      loadingType: 'spinner',
      selector: '#load'
    });
    wx.request({
      url: http + 'WxDmApill/getVehicleDeta',
      data: {id:id},
      method: "GET",
      header: header,
      success: (d) => {
        toast.clear();
        let ires = d.data;
        if (ires.code === 200) {
          // console.log(ires.data)
          console.log(ires)
          this.setData({
            details: ires.data
          })
          //设置标题一直页面名称
          wx.setNavigationBarTitle({
            title: ires.data.b_name
          })
        } else {
          console.log('请求错误');
        }
      },
      fail: () => {
        console.log('请求失败');
      }
    })

  },
  //关闭弹窗
  onClose(){
    this.setData({
      askingshow: false,
      okShow: false
    
    })
  }
})