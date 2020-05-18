// pages/homework/creHomework/creHomework.js
//var util = require('../../../plus/js/times.js');
const util = require('../../../util/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picker: ['软件工程', '英语', '网络工程'],
    index:null,
    textareaAValue:"",
    titleareaAValue:"",
    time: '12:01',
    date: '2020-05-15',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var times = util.formatTime(new Date());
    // var sjc = 1488481383;
    // // time = util.formatTime(new Date(), "yyyy-mm-dd HH:MM:ss");
    //  time = util.formatTime(time, 'Y-M-D'); 
    // console.log(time)

    var date = times[0]
    this.setData({
      date:times[0],
      time:times[1],
    })

    
  },

  

  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },

  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },

  titleareaAInput(e) {
    this.setData({
      titleareaAValue: e.detail.value
    })
  },

  TimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  send: function () {
    var that = this;
    var tno = wx.getStorageSync("studentID")
    var title = that.data.titleareaAValue;
    var text = that.data.textareaAValue;
    var jztime = that.data.date + ' ' + that.data.time;
    var classname = that.data.picker[that.data.index];
    console.log(tno)
    console.log(jztime);
    console.log(classname);
    console.log(text);
    console.log(title);
    if (that.data.index == null || title==''||text==''){
      wx.showModal({
        title: '提示',
        content: '请输入完整信息',
      })
    }else{
      wx.showLoading({
        title: '发送中...',
      });
      wx.request({
        //通过接口获取数据
        url: 'https://andatong.top/wxapp/homework_teacher',
        
        data: {
          Tno: tno,
          title: title,
          content: text,
          class_name:classname,
          end_time:jztime,

        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res);
          if (res.statusCode == 200 && res.data.status == "success") {
            wx.setStorageSync('autoRefreshFlga', "1");

          } else {
            wx.showModal({
              title: '出错啦o(╥﹏╥)o',
              content: '请稍后再试',
              confirmText: '知道啦',
              showCancel: false,
            })
          }
        },
        complete: function (res) {
          that.setData({
            loadModal: false
          })
          wx.hideLoading();
        },
      });

    }

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

  }
})