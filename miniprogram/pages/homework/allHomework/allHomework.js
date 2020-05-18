// pages/homework/allHomework/allHomework.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    homeworkList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      degree: wx.getStorageSync("degree")
    })
    that.getList();
  },

  getList(e) {
    var that = this;
    wx.showLoading({
      title: '加载中……',
    })
    if (that.data.degree == "BKS") {
      //学生
      var Sno = wx.getStorageSync("studentID");
      console.log(Sno)
      wx.request({
        //通过接口获取数据
        url: 'https://andatong.top/wxapp/homework_student',
        data: {
          Sno: Sno,
          status: "待完成"
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res);
          var new_list = res.data.homework_lst; //新获得的数据
          var old_list = that.data.homeworkList; //之前已经获得的数据
          var arr_list = old_list.concat(new_list); //新旧数据合并
          that.setData({
            homeworkList: arr_list,
          })

          //已完成
          wx.request({
          //通过接口获取数据
          url: 'https://andatong.top/wxapp/homework_student',
            data: {
            Sno: Sno,
              status: "已完成"
          },
          method: 'GET',
            header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res);
            var new_list = res.data.homework_lst; //新获得的数据
            var old_list = that.data.homeworkList; //之前已经获得的数据
            var arr_list = old_list.concat(new_list); //新旧数据合并
            that.setData({
              homeworkList: arr_list,
            })
            //已批改
            wx.request({
              //通过接口获取数据
              url: 'https://andatong.top/wxapp/homework_student',
              data: {
                Sno: Sno,
                status: "已批改"
              },
              method: 'GET',
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res);
                var new_list = res.data.homework_lst; //新获得的数据
                var old_list = that.data.homeworkList; //之前已经获得的数据
                var arr_list = old_list.concat(new_list); //新旧数据合并
                that.setData({
                  homeworkList: arr_list,
                })

              },
              complete: function () {
                wx.hideLoading()
              }
            })

          },
          complete: function () {
            
          }
        })

        },
        complete: function () {
         
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
        success: function (res) {
          console.log(res);

          that.setData({
            homeworkList: res.data.homework_lst,
          })
        },
        complete: function () {
          wx.hideLoading()
        }
      })
    }



  },

  // 跳转作业
  toDoHomework(e) {
    console.log(e);
    var id = e.currentTarget.dataset.id
    if (this.data.degree == "BKS") {
      wx.navigateTo({
        url: '/pages/homework/doHomework/doHomework?id=' + id,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (this.data.degree == "JS") {
      wx.navigateTo({
        url: '/pages/homework/teaHomework/teaHomework?id=' + id,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })

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