// pages/homework/teaHomework/teaHomework.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    size: 1,
    textareaAValue: "",

    homeworkDetial: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log("options-id");
    var id = options.id;
    that.setData({
      id:id,
    })
    console.log(id)
    wx.showLoading({
      title: '加载中……',
    })
    wx.request({
      //通过接口获取数据
      url: 'https://andatong.top/wxapp/singl_homework_info',
      data: {
        character: "teacher",
        homework_id: id,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        // var new_mail = res.data; //新获得的数据
        // var old_mail = that.data.mail; //之前已经获得的数据
        // var arr_mail = old_mail.concat(new_mail); //新旧数据合并
        that.setData({
          homeworkDetial: res.data,
        })
      },
      complete: function (e) {
        wx.hideLoading()
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  toPgHomework(e) {
    console.log(e);
    var answer =e.currentTarget.dataset.an;
    console.log(answer)
    wx.setStorageSync("answer", answer)
    wx.navigateTo({
      url: '/pages/homework/pgHomework/pgHomework',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var autoRefreshFlag = wx.getStorageSync("autoRefreshList");
    var id = this.data.id;
    if (autoRefreshFlag == 1) {
      var ops = {
        "id":id
      }
      wx.setStorageSync('autoRefreshList', '0');
      this.onLoad(ops);
    }
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