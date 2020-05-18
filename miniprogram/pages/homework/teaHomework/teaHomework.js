// pages/homework/teaHomework/teaHomework.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    size: 1,
    textareaAValue: "",

    homeworkDetial: {
      id: 5,
      title: "课程第五章",
      proContext: "1.字号大小。一个好的小程序UI界面,首先映入眼帘的就是页面字号大小,下面是眼睛距离与常用的字号大小关系:视距近:30cm以内字号使用:9pt(点)——12pt(点)网...2.色彩设计中讲究形与色的组合, 具体用什么主色调, 要根据小程序的类型来选择, ...3.布局排版布局, 就是小程序内各版块、图标、文字的排列。通过合理的布局, 我们能让访客...4.这些都是新人刚入行的基本小程序UI设计规范, 希望对你有帮助。",
      teacher: "周国强",
      classname: "软件工程",
      time: "2020-05-15 12:00",
      pgstatus: 2,
      sunmitNumber: 15,
      allNumber: 30,
      studentStatus:[
        {
          studentid: "YA1717177",
          studentname: "杨紫",
          pgstatus:1,

        },
        {
          studentid: "YA1712377",
          studentname: "张云",
          pgstatus: 2,
          score: 90,
        },
        {
          studentid: "YA1799977",
          studentname: "杨子健",
          pgstatus: 2,
          score: 90,
        },
        {
          studentid: "YA1717177",
          studentname: "奥斯卡",
          pgstatus: 1,

        },
        {
          studentid: "YA1717177",
          studentname: "超宇",
          pgstatus: 1,

        },
      ]

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log("options-id");
    var id = options.id;
    console.log(id)

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