// pages/home/home.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    tabtext: ['待完成', '已完成', '已批改'],
    homeworkList: [{
        id: 2,
        title: '第四章课后习题',
        name: "庄羽",
        classname: "算法",
        time: "2020-05-15",
        status: 1
      }, {
        id: 2,
        title: '试卷',
        name: "周宇",
        classname: "软件工程",
        time: "2020-05-17",
        status: 1
      }, {
        id: 2,
        title: '第三课课后习题',
        name: "周宇",
        classname: "软件工程",
        time: "2020-05-20",
        status: 1
      }, {
        id: 1,
        title: '第四章课后习题',
        name: "周宇",
        classname: "啦啦啦",
        time: "2020-05-20",
        status: 1
      }, {
        id: 1,
        title: '阿拉啦啦啦',
        name: "周宇",
        classname: "软件工程",
        time: "2020-05-20",
        status: 1
      }

    ],

    pgList: [{
      id: 2,
      title: '第四章课后习题',
      name: "庄羽",
      classname: "算法",
      time: "2020-05-15",
      pgstatus: 2
    }, {
      id: 2,
      title: '试卷',
      name: "周宇",
      classname: "软件工程",
      time: "2020-05-17",
      pgstatus: 2
    }, {
      id: 1,
      title: '第三课课后习题',
      name: "周宇",
      classname: "软件工程",
      time: "2020-05-20",
      pgstatus: 1
    }, {
      id: 1,
      title: '第四章课后习题',
      name: "周宇",
      classname: "啦啦啦",
      time: "2020-05-20",
      pgstatus: 1
    }, {
      id: 1,
      title: '阿拉啦啦啦',
      name: "周宇",
      classname: "软件工程",
      time: "2020-05-20",
      pgstatus: 1
    }

    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log(getApp().globalData.userInfo);
    console.log(wx.getStorageSync('studentPW'))
    if (wx.getStorageSync('studentPW') == "") {
      that.setData({
        loginOrNot: false

      })
    } else {
      that.setData({
        loginOrNot: true,
        degree:wx.getStorageSync("degree")

      })
      that.getList();
    }

    
  },

  getList(e){
    var that = this;
    if(that.data.degree=="BKS"){
      //学生
      if (that.data.TabCur == 0) {
        var status = "待完成"
      } else if (that.data.TabCur == 1) {
        var status = "已完成"
      } else if (that.data.TabCur == 2) {
        var status = "已批改其中之一"
      }
      var Sno = wx.getStorageSync("studentID");
      console.log(Sno)
      wx.request({
        //通过接口获取数据
        url: 'https://andatong.top/wxapp/homework_student',
        data: {
          Sno: Sno,
          status: status
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
            homeworkList: res.data.homework_lst,
          })
        }
      })
    }else if(that.data.degree=="JS"){
      //教师
      var tno = wx.getStorageSync("studentID")
      wx.request({
        //通过接口获取数据
        url: 'https://andatong.top/wxapp/homework_teacher',
        data: {
          tno: tno,
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
          // that.setData({
          //   mail: arr_mail,
          // })
        }
      })
    }
    


    // wx.cloud.callFunction({
    //   name: 'hmlist',
    //   data: {},
    //   success: res => {
    //     console.log(res)
        
    //   },
    //   fail: err => {
    //     console.error('[云函数] [login] 调用失败', err)
        
    //   }
    // })
    

  },


  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    this.getList();
  },

  // 跳转作业
  toDoHomework(e){
    console.log(e);
    var id=e.currentTarget.dataset.id
    if(this.data.degree=="BKS"){
      wx.navigateTo({
        url: '/pages/homework/doHomework/doHomework?id=' + id,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else if(this.data.degree=="JS"){
      wx.navigateTo({
        url: '/pages/homework/teaHomework/teaHomework?id=' + id,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      
    }

  },

  toCreatHm(e){
    wx.navigateTo({
      url: '/pages/homework/creHomework/creHomework',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
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
    var autoRefreshFlag = wx.getStorageSync("autoRefreshFlag");
    if (autoRefreshFlag == 1) {
      wx.setStorageSync('jumpScheduleFlag', '0');
      this.onLoad();
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