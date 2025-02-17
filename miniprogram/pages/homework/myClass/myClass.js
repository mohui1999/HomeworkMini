// pages/homework/myClass/myClass.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classList: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.showLoading({
      title: '加载中……',
    })

    if (wx.getStorageSync("degree") == "BKS") {
      wx.request({
        //通过接口获取数据
        url: 'https://andatong.top/wxapp/class_api',
        data: {
          Sno: wx.getStorageSync("studentID"),
          all_or_my: "my",
          character: "student",

        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          console.log(res);
          // var new_mail = res.data; //新获得的数据
          // var old_mail = that.data.mail; //之前已经获得的数据
          // var arr_mail = old_mail.concat(new_mail); //新旧数据合并
          that.setData({
            classList: res.data.class_lst,
          })
        },

        complete: function() {
          wx.hideLoading()
        }
      })
    } else if (wx.getStorageSync("degree") == "JS") {
      wx.request({
        //通过接口获取数据
        url: 'https://andatong.top/wxapp/class_api',
        data: {
          Tno: wx.getStorageSync("studentID"),
          all_or_my: "my",
          character: "teacher",

        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          console.log(res);
          // var new_mail = res.data; //新获得的数据
          // var old_mail = that.data.mail; //之前已经获得的数据
          // var arr_mail = old_mail.concat(new_mail); //新旧数据合并
          that.setData({
            classList: res.data.class_lst,
          })
        },

        complete: function() {
          wx.hideLoading()
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})