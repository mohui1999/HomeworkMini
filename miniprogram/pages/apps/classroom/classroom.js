// pages/apps/classroom/classroom.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [
      [
        '磬苑校区',
        '龙河校区',
      ],
      [
        '1,2节',
        '3,4节',
        '5,6节',
        '7,8节',
        '9,10,11节',
        '上午',
        '下午',
        '晚上',
        '白天',
        '整天'
      ]
    ],
    multiIndex: [0, 0],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var compusindex = 'multiIndex[' + 0 + ']';
    var timeindex = 'multiIndex[' + 1 + ']';
    if (wx.getStorageSync("compus") == '') {
      wx.setStorageSync("compus", 1)
    } else {
      this.setData({
        [compusindex]: wx.getStorageSync("compus") - 1,
        [timeindex]: 0
      })
    }
    this.formSubmit();


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

  },

  formSubmit: function(e) {

    var time = this.data.multiIndex[1] + 1;

    console.log(time)
    var that = this
    wx.showLoading({
      title: '正在加载中...',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    wx.request({
      url: 'https://lzzzzl.top/info',
      data: {
        user: 'YA1714192',
        password: "113067LOVE112920",
        choice: 4,
        degree: "BKS",
        campus: wx.getStorageSync("compus"),
        time: time,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        console.log("查询中")
        console.log(res.data)
        if (res.data == 0) {
          wx.showModal({
            title: '查询失败! ',
            content: '抱歉，因学校教务系统出现问题，本功能暂时无法使用，学校方面修复后，我们将在第一时间通知您。',
            showCancel: false,
            confirmText: '知道啦',
            duration: 1000,
            mask: true,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        } else {
          wx.showToast({
            title: '查询成功！',
            icon: 'success',
            image: '',
            duration: 1000,
            mask: true,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
        var allemptyroom = res.data;
        that.setData({
          classroom_info: allemptyroom
        })
        /*
        var room = res.data.empty_room_lst[0]
        console.log(room)
        var seat = res.data.empty_room_lst[1]
        var today = rs.data.today
        var len = room.length
        console.log(len)
        var temp = []
        for(var i=0;i<len;i++){
          var t = {}
          t.room = room[i]
          t.seat = seat[i]
          temp[i] = t
        }
        */


      },
      fail: function(res) {},
      complete: function(res) {
        //wx.hideLoading()
      },
    })
  },

  PickerChange: function(e) {
    this.setData({
      multiIndex: e.detail.value
    })

    var compus = e.detail.value[0] + 1;
    console.log("compus")
    wx.setStorageSync("compus", compus)
  }
})