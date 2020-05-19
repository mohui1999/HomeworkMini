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
    homeworkList: [],

    pgList: [],

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
        degree: wx.getStorageSync("degree")

      })
      that.getList();
    }


  },

  getList(e) {
    var that = this;
    wx.showLoading({
      title: '加载中……',
    })
    if (that.data.degree == "BKS") {
      //学生
      if (that.data.TabCur == 0) {
        var status = "待完成"
      } else if (that.data.TabCur == 1) {
        var status = "已完成"
      } else if (that.data.TabCur == 2) {
        var status = "已批改"
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
        success: function(res) {
          console.log(res);
          // var new_mail = res.data; //新获得的数据
          // var old_mail = that.data.mail; //之前已经获得的数据
          // var arr_mail = old_mail.concat(new_mail); //新旧数据合并
          var homeworkList = res.data.homework_lst;
          var x;
          for (x in homeworkList) {
            //时间处理，截止时间
            var time = homeworkList[x].end_time;
            console.log(time)
            var note = "";
            if (time != "无截止时间") {
              var yy = parseInt(time.substring(0, 4));
              console.log(yy)
              var mm = parseInt(time.substring(5, 8)) - 1;
              console.log(mm)
              var dd = parseInt(time.substring(8, 10));
              console.log(dd)
              //var hh = parseInt(time.substring(time.indexOf("(") + 1, time.indexOf(":")));
              //var minute = parseInt(time.substring(time.indexOf(":") + 1, time.indexOf("-")));
              var hh = parseInt(time.substring(11, 13));
              var minute = parseInt(time.substring(14, 16));
              console.log(hh + " " + minute)
              if (mm)
                var targetTime = (new Date(yy, mm, dd, hh, minute, 0)).getTime();
              else
                var targetTime = (new Date(yy, mm, dd, hh, minute, 0)).getTime();
              var currentTime = Date.now();
              var offsetTime = targetTime - currentTime;
              console.log(targetTime)
              console.log(currentTime)
              console.log(offsetTime)
              
              console.log(offsetTime < 86400000)
              console.log(offsetTime > 0)
              if (offsetTime <= 345600000 && offsetTime >= 86400000) {
                var days = parseInt(offsetTime / 86400000);
                note = "离截止日期还有" + days + "天";
              } else if (offsetTime > 0 && offsetTime < 86400000) {
                var hours = parseInt(offsetTime / 3600000)
                console.log(hours)
                note = "离截止时间还有" + hours + "小时";
              } else if (offsetTime <= 0) {
                note = "已到截止时间";
              }
            }
            homeworkList[x].note=note;
          }
          that.setData({
            homeworkList: homeworkList,
          })
        },
        complete: function() {
          wx.hideLoading()
        }
      })
    } else if (that.data.degree == "JS") {
      //教师
      var tno = wx.getStorageSync("studentID")
      wx.request({
        //通过接口获取数据
        url: 'https://andatong.top/wxapp/homework_teacher',
        data: {
          Tno: tno,
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          console.log(res);

          that.setData({
            pgList: res.data.homework_lst,
          })
        },
        complete: function() {
          wx.hideLoading()
        }
      })
    }

  },


  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    this.getList();
  },

  // 跳转作业
  toDoHomework(e) {
    console.log(e);
    var id = e.currentTarget.dataset.id
    if (this.data.degree == "BKS") {
      wx.navigateTo({
        url: '/pages/homework/doHomework/doHomework?id=' + id,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else if (this.data.degree == "JS") {
      wx.navigateTo({
        url: '/pages/homework/teaHomework/teaHomework?id=' + id,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })

    }

  },

  toCreatHm(e) {
    wx.navigateTo({
      url: '/pages/homework/creHomework/creHomework',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
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
      wx.setStorageSync('autoRefreshFlag', '0');
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