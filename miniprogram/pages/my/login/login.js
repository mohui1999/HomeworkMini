const app = getApp()

Page({

  data: {
    "schoolTerm": "2018-2019学期 上学期",
    "lastID": "",
    "id": "",
    "pw": "",
    degree: "BKS",
    show: 'password',
    isShow: false,
    loadModal: false,
  },

  onLoad: function(options) {
    // if (!wx.getStorageSync('rememberFlag')) {
    //   wx.removeStorageSync('studentPW');
    // }
    if (wx.getStorageSync("degree") == '') {
      wx.setStorageSync("degree", "BKS");
      var degreechoose = "BKS"
    } else {
      var degreechoose = wx.getStorageSync("degree");
    }

    var lastID = wx.getStorageSync('studentID');
    var lastPW = wx.getStorageSync('studentPW');

    // var isShow = wx.getStorageSync("isShow")
    // if (isShow && isShow!='') {   
    //   this.setData({
    //     isShow: true,
    //     show: "text"
    //   })
    // } else if (isShow==false && isShow != '') {
    //   this.setData({

    //     isShow: false,
    //     show: "password"
    //   })
    // }
    this.setData({
      degreechoose: degreechoose,
      degree: degreechoose,

    })

    this.setData({
      headHeight: getApp().globalData.headHeight,
      textHeight: getApp().globalData.textHeight,
      backHeight: getApp().globalData.backHeight,
      rememberFlag: wx.getStorageSync('rememberFlag'),
      lastID: lastID,
      id: lastID,
      lastPW: lastPW,
      pw: lastPW
    })
  },
  getID: function(e) {
    this.setData({
      "id": e.detail.value
    });
    wx.setStorageSync('studentID', e.detail.value);
  },
  getPW: function(e) {
    this.setData({
      "pw": e.detail.value
    });
  },
  getSchedule: function() {

    var that = this;
    that.setData({
      loadModal: true
    })
    if (that.data.degree == "JS") {

      //教师用户
      setTimeout(function() {
        wx.request({
          url: 'https://andatong.top/wxapp/teacher_login',
          data: {
            Tno: that.data.id,
            pw: that.data.pw,
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function(res) {
            console.log("教务认证");
            console.log(res)
            wx.hideLoading();
            if (res.statusCode == 200) {
              if (res.data.error == -2) {
                wx.showModal({
                  title: '错误',
                  content: '用户名或密码错误\n' +
                    '请重试 (つд⊂)',
                  showCancel: false,
                  success: function(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                });
              } else if (res.data.error == -3) {
                wx.showModal({
                  title: '错误',
                  content: '请先登录旧版教务系统, 完成教师评价后,' +
                    '再重试 (つд⊂)',
                  showCancel: false,
                  success: function(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                });

              } else if (res.data.error == -4) {
                wx.showModal({
                  title: '错误',
                  content: '学校教务系统故障, ' +
                    '请稍后重试',
                  showCancel: false,
                  success: function(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                });
              } else if (res.data.error != undefined) {
                var errorcontext = res.data.error;
                wx.showModal({
                  title: '提示',
                  content: errorcontext,
                  showCancel: false,
                  success: function(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                });
              } else {
                console.log("教师登录成功");
                //wx.setStorageSync('wlist', res.data);
                wx.setStorageSync('jumpScheduleFlag', '1');
                wx.setStorageSync('studentPW', that.data.pw);
                wx.setStorageSync('autoRefreshFlag', "1");
                getApp().globalData.newFlag = 0;
                if (getApp().globalData.newChooseFlag === 2) {
                  getApp().globalData.newChooseFlag = 1;
                }

                that.setData({
                  loadModal: false
                })
                wx.showToast({
                  title: '认证成功',
                  icon: 'success',
                  duration: 1000
                });
                setTimeout(function() {
                  wx.navigateBack();
                }, 1000);
              }
            }
          }
        })
      }, 50);


    } else {

      //学生用户
      setTimeout(function() {
        wx.request({
          url: 'https://lzzzzl.top/info',
          data: {
            user: that.data.id,
            password: that.data.pw,
            choice: 1,
            degree: that.data.degree
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },

          // method: "GET",
          // header: {
          //   "content-type": "application/json"
          // },

          success: function(res) {
            console.log("教务认证");
            console.log(res)
            wx.hideLoading();
            if (res.statusCode == 200) {
              if (res.data.error == -2) {
                wx.showModal({
                  title: '错误',
                  content: '用户名或密码错误\n' +
                    '请重试 (つд⊂)',
                  showCancel: false,
                  success: function(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                });
              } else if (res.data.error == -3) {
                wx.showModal({
                  title: '错误',
                  content: '请先登录旧版教务系统, 完成教师评价后,' +
                    '再重试 (つд⊂)',
                  showCancel: false,
                  success: function(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                });

              } else if (res.data.error == -4) {
                wx.showModal({
                  title: '错误',
                  content: '学校教务系统故障, ' +
                    '请稍后重试',
                  showCancel: false,
                  success: function(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                });
              } else if (res.data.error != undefined) {
                var errorcontext = res.data.error;
                wx.showModal({
                  title: '提示',
                  content: errorcontext,
                  showCancel: false,
                  success: function(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                });
              } else {
                //wx.setStorageSync('wlist', res.data);
                wx.setStorageSync('jumpScheduleFlag', '1');
                wx.setStorageSync('studentPW', that.data.pw);
                wx.setStorageSync('autoRefreshFlag', "1");
                getApp().globalData.newFlag = 0;
                if (getApp().globalData.newChooseFlag === 2) {
                  getApp().globalData.newChooseFlag = 1;
                }
                console.log("wx");
                console.log(getApp().globalData.userInfo.avatarUrl)
                if (that.data.degree == "BKS") {
                  // wx.request({
                  //   url: 'https://andatong.top/wxapp/create_student',
                  //   data: {
                  //     Sno: wx.getStorageSync('studentID'),
                  //     name: getApp().globalData.userInfo.nickName,
                  //     userAvatar: getApp().globalData.userInfo.avatarUrl
                  //   },
                  //   method: 'POST',
                  //   header: {
                  //     'content-type': 'application/x-www-form-urlencoded'
                  //   },
                  //   success: function(e) {
                  //     console.log(e)

                  //   },
                  // })
                }


                that.setData({
                  loadModal: false
                })
                wx.showToast({
                  title: '认证成功',
                  icon: 'success',
                  duration: 1000
                });
                setTimeout(function() {
                  wx.navigateBack();
                }, 1000);
              }
            }
          }
        })
      }, 50);
      // if (wx.getStorageSync('rememberFlag')) {
      //   wx.setStorageSync('studentPW', that.data.pw);
      // }

    }
  },


  changeRemember: function(e) {
    if (e.detail.value) {
      wx.setStorageSync('rememberFlag', 1);
    } else {
      wx.setStorageSync('rememberFlag', 0);
    }
  },
  onBack: function() {
    wx.navigateBack();
  },

  radiochange: function(res) {
    console.log(res)
    var degree = res.detail.value;
    this.setData({
      degree: degree
    })

    wx.setStorageSync("degree", degree)
  },

  showPassword: function() {
    if (this.data.isShow) { //如果this.data.isShow为true,则表示为密码小黑点
      this.setData({
        isShow: false,
        show: "password"

      })
      //wx.setStorageSync('isShow', false)
    } else {
      this.setData({
        isShow: true,
        show: "text"
      })
      //wx.setStorageSync('isShow', true)
    }
  },

})