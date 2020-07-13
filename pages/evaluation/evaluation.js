// pages/evaluation/evaluation.js
const app = getApp();
const http = app.globalData.http;
const header = app.globalData.header;
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count:0,
    http:http,
    toast: Toast,
    //数据列表
    listdata:[],
    //分页
    parameter: {
      page: 1,
      limit: 10,
      show: "more" //more:更多，,hide//结束
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {id} = options;
      let parameter=this.data.parameter;
      parameter.id = id;
      this.getData(parameter,(res)=>{
        if (res.length >= parameter.limit) {
          parameter.show = 'more'
        } else if (res.length < parameter.limit) {
          parameter.show = 'hide'
        }
        this.setData({
          listdata:res,
          parameter:  parameter        
        })
       
      });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //获取详情大图
  imgsrc(e) {
    let index = e.currentTarget.dataset.index;
    let imgs = e.currentTarget.dataset.img;
   
    imgs = imgs.map((item) => {
      return http + item;
    })
    wx.previewImage({
      current: imgs[index], // 当前显示图片的http链接  
      urls: imgs
    })
  },
  //获取更多数据
  moreGetData() {
    let param = this.data.parameter;
    param.page = param.page + 1;

    this.getData(param, (res) => {
      if (res.length >= param.limit) {
        param.show = 'more'
      } else if (res.length < param.limit) {
        param.show = 'hide'
      }
      for (let i = 0; i < res.length; i++) {
        this.data.dataList.push(res[i]);
      }
      this.setData({
        parameter: param,
        dataList: this.data.dataList
      })
    })
  },
  //获取数据
  getData(data,f) {
    const toast = this.data.toast.loading({
      duration: 0,       // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      message: '加载中...',
      loadingType: 'spinner',
      selector: '#load'
    });
    wx.request({
      url: http + 'WxDmApill/getCommentary',
      data:data,
      method: "GET",
      header: header,
      success: (d) => {
        toast.clear();
        let ires = d.data;
       
        this.setData({
          count: ires.data.count
        })
        if (ires.code === 200) {
          f(ires.data.data)
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