// pages/homework/enterClass/enterClass.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classnumber: '',
    name:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  numberareaAInput(e) {
    this.setData({
      classnumber: e.detail.value
    })
  },
  nameareaAInput(e) {
    this.setData({
      name: e.detail.value
    })
  },
  enter(e) {
    var that =this;
    if (this.data.classnumber != ''&& that.data.name!='') {
      wx.request({
        //通过接口获取数据
        url: 'https://andatong.top/wxapp/class_api',
        data: {
          Sno: wx.getStorageSync("studentID"),
          character: "student",
          class_id: this.data.classnumber,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function(res) {
          console.log(res);
          console.log(getApp().globalData.userInfo.avatarUrl)
          if(res.data.status=="success"){
            wx.request({
              url: 'https://andatong.top/wxapp/create_student',
              data: {
                Sno: wx.getStorageSync('studentID'),
                name: that.data.name,
                userAvatar: getApp().globalData.userInfo.avatarUrl
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (e) {
                console.log(e)
                wx.showModal({
                  title: '成功',
                  content: '加入班级成功',
                  showCancel: false,
                })

              },
            })
            
          }else{
            wx.showModal({
              title: '提示',
              content: '请输入正确班级码',
            })
          }
          
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请输入正确班级码',
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