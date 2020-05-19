Page({
  data: {
    floatWindowFlag: 0,
    offsetDays: "--",
    offsetHours: "--",
    offsetMinutes: "--",
    offsetSeconds: "--",
    examSoon: ["-------"],
    daySoon: 99,
    show_login: false,
    loadModal: false
  },

  // onLoad: function (options) {
  // },
  onLoad: function () {
    var that = this;
    if (wx.getStorageSync('studentPW') == "") {
      wx.showModal({
        title: '未认证',
        content: '请先认证教务系统\n然后再使用与教务相关的功能',
        confirmText: '去认证',
        showCancel: true,
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../my/login/login',
            })
          } else if (res.cancel) {
            wx.navigateBack();
          }
        }
      });
    }
    else {
      var xh = wx.getStorageSync('studentID');
      var pwd = wx.getStorageSync('studentPW');
      var degree = wx.getStorageSync("degree")
      that.setData({
        show_login: false,
        xh: xh,
        pwd: pwd,
        degree: degree
      });

      that.get_examroom();
    }
  },
  // 更新数据
  refresh: function (e) {
    var that = this
    var xh = this.data.xh
    var pwd = this.data.pwd
    // wx.showLoading({
    //   title: '考场加载中',
    // });

    that.setData({
      loadModal: true
    })
    var degree = wx.getStorageSync("degree")
    wx.request({
      url: 'https://lzzzzl.top/info',
      //url: 'https://www.ahutong.com/users/exam_room_spider',
      data: {
        user: that.data.xh,
        password: that.data.pwd,
        choice: 3,
        degree: that.data.degree
      },
      // method: "GET",
      // header: {
      //   "content-type": "application/json"
      // },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      // dataType: 'json',
      // responseType: 'text',
      success: function (res) {
        if (res.data.length == 0) {
          wx.hideLoading();
          wx.showModal({
            title: '暂无考试! ',
            content: '未查到您的考场信息!',
            showCancel: false,
            confirmText: '知道啦',
            duration: 1000,
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
        else if (res.data.error == -3) {
          wx.hideLoading();
          wx.showModal({
            title: '错误',
            content: '请先登录旧版教务系统, 完成教师评价后,' +
              '再重试 (つд⊂)',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          });

        }
        else if (res.data.error == -4) {
          wx.hideLoading();
          wx.showModal({
            title: '错误',
            content: '学校教务系统故障, ' +
              '请稍后重试',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          });
        } else if (res.data.error == -2) {
          wx.hideLoading();
          wx.showModal({
            title: '错误',
            content: '网络异常, ' +
              '请稍后重试',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          });
        } else if (res.data.statusCode == 502) {
          wx.hideLoading();
          wx.showModal({
            title: '错误',
            content: '网络异常, ' +
              '请稍后重试',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          });
        }
        else {
          if (res.data.error == undefined) {
            wx.hideLoading();

            that.setData({
              loadModal: false
            })
            wx.showToast({
              title: '查询成功！',
              icon: 'success',
              duration: 1000,
              mask: true,
            });
            var examroom = res.data
            wx.setStorage({
              key: 'examroom',
              data: [examroom],
            })
            that.setData({
              show_login: false,
              examroom: examroom,
              newFlag: 1,
            });
            var list = that.data.examroom;
            console.log(list)
            for (var aa = 0; aa < list.length; aa++) {
              //时间处理
              var time = list[aa].KSSJ;
              var yy = parseInt(time.substring(0, time.indexOf("年")));
              var mm = parseInt(time.substring(5, time.indexOf("月"))) - 1;
              var dd = parseInt(time.substring(time.indexOf("月") + 1, time.indexOf("日")));
              //var hh = parseInt(time.substring(time.indexOf("(") + 1, time.indexOf(":")));
              //var minute = parseInt(time.substring(time.indexOf(":") + 1, time.indexOf("-")));
              var time2 = time.substring(time.indexOf("-"), time.length);
              var hh = parseInt(time2.substring(time2.indexOf("-") + 1, time2.indexOf(":")));
              var minute = parseInt(time2.substring(time2.indexOf(":") + 1, time2.indexOf(")")));
              if (mm)
                var targetTime = (new Date(yy, mm, dd, hh, minute, 0)).getTime();
              else
                var targetTime = (new Date(yy, mm, dd, hh, minute, 0)).getTime();
              var currentTime = Date.now();
              var offsetTime = targetTime - currentTime;
              if (offsetTime > 0) {
                if (mm)
                  targetTime = (new Date(yy, mm, dd, 0, 0, 0)).getTime();
                else
                  targetTime = (new Date(yy, mm, dd, 0, 0, 0)).getTime();
                currentTime = Date.now();
                offsetTime = targetTime - currentTime;
                var offsetDays = Math.floor(offsetTime / (3600 * 24 * 1e3)) + 1;
                var examList = [];
                for (var bb = aa; bb < list.length; bb++) {
                  var time1 = list[bb].KSSJ;
                  var mm1 = parseInt(time1.substring(5, time1.indexOf("月"))) - 1;
                  var dd1 = parseInt(time1.substring(time1.indexOf("月") + 1, time1.indexOf("日")));
                  if (mm1 == mm && dd1 == dd) {
                    examList.push(list[bb].KCMC);
                  }
                  else {
                    break;
                  }
                }
                break;
              }
            }
            if (aa == list.length) {
              offsetDays = "99";
              examList = ["考试结束啦!"];
            }
            that.setData({
              daySoon: offsetDays,
              boundary: aa,
              examSoon: examList
            });
          }
          else {
            wx.hideLoading();
            wx.showModal({
              title: '请重新认证',
              content: '密码错误, 请重新完成教务认证',
              confirmText: '去认证',
              showCancel: true,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../../my/login/login',
                  })
                } else if (res.cancel) {
                  wx.navigateBack();
                }
              }
            });
          }
        }
      },
      fail: function (res) {
        that.setData({
          show_login: true,
        })
      },
      // 从后台获取数据结束
      complete: function (res) {

        that.setData({
          loadModal: false
        })
      },
    });
  },

  get_examroom: function () {
    var that = this
    var xh = this.data.xh
    var pwd = this.data.pwd
    var degree = this.data.degree

    wx.getStorage({
      key: 'examroom',
      success: function (res) {
        var examroom = res.data[0]
        that.setData({
          show_login: false,
          examroom: examroom,
        });
        var list = that.data.examroom;
        console.log(list)
        for (var aa = 0; aa < list.length; aa++) {
          var time = list[aa].KSSJ;
          var yy = parseInt(time.substring(0, time.indexOf("年")));
          var mm = parseInt(time.substring(5, time.indexOf("月"))) - 1;
          console.log(mm)
          var dd = parseInt(time.substring(time.indexOf("月") + 1, time.indexOf("日")));
          console.log(dd)
          //var hh = parseInt(time.substring(time.indexOf("(") + 1, time.indexOf(":")));
          //var minute = parseInt(time.substring(time.indexOf(":") + 1, time.indexOf("-")));
          var time2 = time.substring(time.indexOf("-"), time.length);
          var hh = parseInt(time2.substring(time2.indexOf("-") + 1, time2.indexOf(":")));
          var minute = parseInt(time2.substring(time2.indexOf(":") + 1, time2.indexOf(")")));
          if (mm)
            var targetTime = (new Date(yy, mm, dd, hh, minute, 0)).getTime();
          else
            var targetTime = (new Date(yy, mm, dd, hh, minute, 0)).getTime();
          var currentTime = Date.now();
          var offsetTime = targetTime - currentTime;
          if (offsetTime > 0) {
            if (mm)
              targetTime = (new Date(yy, mm, dd, 0, 0, 0)).getTime();
            else
              targetTime = (new Date(yy, mm, dd, 0, 0, 0)).getTime();
            currentTime = Date.now();
            offsetTime = targetTime - currentTime;
            var offsetDays = Math.floor(offsetTime / (3600 * 24 * 1e3)) + 1;
            var examList = [];
            for (var bb = aa; bb < list.length; bb++) {
              var time1 = list[bb].KSSJ;
              var mm1 = parseInt(time1.substring(5, time1.indexOf("月"))) - 1;
              var dd1 = parseInt(time1.substring(time1.indexOf("月") + 1, time1.indexOf("日")));
              if (mm1 == mm && dd1 == dd) {
                examList.push(list[bb].KCMC);
              }
              else {
                break;
              }
            }
            break;
          }
        }
        if (aa == list.length) {
          offsetDays = "99";
          examList = ["考试结束啦!"];
        }
        that.setData({
          daySoon: offsetDays,
          boundary: aa,
          examSoon: examList
        });
      },
      fail: function (res) {

        that.setData({
          loadModal: true
        })
        // wx.showLoading({
        //   title: '考场加载中...',
        //   mask: true,
        // })
        wx.request({
          url: 'https://lzzzzl.top/info',
          //url: 'https://www.ahutong.com/users/exam_room_spider',
          data: {
            user: that.data.xh,
            password: that.data.pwd,
            choice: 3,
            degree: that.data.degree
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          // header: {
          //   'Content-Type': 'application/json'
          // },
          // method: 'GET',
          // dataType: 'json',
          // responseType: 'text',

          success: function (res) {

            console.log(res)
            if (res.data.length == 0) {
              wx.hideLoading();
              wx.showModal({
                title: '暂无考试! ',
                content: '未查到您的考场信息!',
                showCancel: false,
                confirmText: '知道啦',
                duration: 1000,
                mask: true,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
            }
            else if (res.data.error == -3) {
              wx.hideLoading();
              wx.showModal({
                title: '错误',
                content: '请先登录旧版教务系统, 完成教师评价后,' +
                  '请重试 (つд⊂)',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              });

            }
            else if (res.data.error == -4) {
              wx.hideLoading();
              wx.showModal({
                title: '错误',
                content: '学校教务系统故障, ' +
                  '请稍后重试',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              });
            } else if (res.data.error == -2) {
              wx.hideLoading();
              wx.showModal({
                title: '错误',
                content: '网络异常, ' +
                  '请稍后重试',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              });
            } else if (res.data.statusCode == 502) {
              wx.hideLoading();
              wx.showModal({
                title: '错误',
                content: '网络异常, ' +
                  '请稍后重试',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              });
            }
            else {
              if (res.data.error == undefined) {
                wx.hideLoading();

                that.setData({
                  loadModal: false
                })
                wx.showToast({
                  title: '查询成功！',
                  icon: 'success',
                  duration: 1000,
                  mask: true,
                })
                var examroom = res.data

                wx.setStorage({
                  key: 'examroom',
                  data: [examroom],
                })
                that.setData({
                  show_login: false,
                  examroom: examroom,
                  newFlag: 1,
                })
                var list = that.data.examroom;
                console.log(list)
                for (var aa = 0; aa < list.length; aa++) {
                  var time = list[aa].KSSJ;
                  var yy = parseInt(time.substring(0, time.indexOf("年")));
                  var mm = parseInt(time.substring(5, time.indexOf("月"))) - 1;
                  console.log(mm)
                  var dd = parseInt(time.substring(time.indexOf("月") + 1, time.indexOf("日")));
                  console.log(dd)
                  //var hh = parseInt(time.substring(time.indexOf("(") + 1, time.indexOf(":")));
                  //var minute = parseInt(time.substring(time.indexOf(":") + 1, time.indexOf("-")));
                  var time2 = time.substring(time.indexOf("-"), time.length);
                  var hh = parseInt(time2.substring(time2.indexOf("-") + 1, time2.indexOf(":")));
                  var minute = parseInt(time2.substring(time2.indexOf(":") + 1, time2.indexOf(")")));
                  if (mm)
                    var targetTime = (new Date(yy, mm, dd, hh, minute, 0)).getTime();
                  else
                    var targetTime = (new Date(yy, mm, dd, hh, minute, 0)).getTime();
                  var currentTime = Date.now();
                  var offsetTime = targetTime - currentTime;
                  if (offsetTime > 0) {
                    if (mm)
                      targetTime = (new Date(yy, mm, dd, 0, 0, 0)).getTime();
                    else
                      targetTime = (new Date(yy, mm, dd, 0, 0, 0)).getTime();
                    currentTime = Date.now();
                    offsetTime = targetTime - currentTime;
                    var offsetDays = Math.floor(offsetTime / (3600 * 24 * 1e3)) + 1;
                    var examList = [];
                    for (var bb = aa; bb < list.length; bb++) {
                      var time1 = list[bb].KSSJ;
                      var mm1 = parseInt(time1.substring(5, time1.indexOf("月"))) - 1;
                      var dd1 = parseInt(time1.substring(time1.indexOf("月") + 1, time1.indexOf("日")));
                      if (mm1 == mm && dd1 == dd) {
                        examList.push(list[bb].KCMC);
                      }
                      else {
                        break;
                      }
                    }
                    break;
                  }
                }
                if (aa == list.length) {
                  offsetDays = "99";
                  examList = ["考试结束啦!"];
                }
                that.setData({
                  daySoon: offsetDays,
                  boundary: aa,
                  examSoon: examList
                });
              }
              else {
                wx.hideLoading();
                wx.showModal({
                  title: '请重新认证',
                  content: '密码错误, 请重新完成教务认证',
                  confirmText: '去认证',
                  showCancel: true,
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '../../my/login/login',
                      })
                    } else if (res.cancel) {
                      wx.navigateBack();
                    }
                  }
                });
              }
            }
          },
          fail: function (res) {
            that.setData({
              show_login: true,
            })
          },
          // 从后台获取数据结束
          complete: function (res) {

            that.setData({
              loadModal: false
            })
          },
        })
      },
      // 最终结束
      complete: function (res) { },
    })
  },

  // 点击了查询按钮
  formSubmit: function (e) {
    var that = this;
    var xh_pwd = e.detail.value;
    // 将用户填入的学号和密码保存在缓存
    wx.setStorage({
      key: 'xh_pwd',
      data: xh_pwd,
      success: function (res) {
        that.setData({
          xh: xh_pwd['number'],
          pwd: xh_pwd['password']
        })
        that.get_examroom()
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  closeTip: function () {
    this.setData({
      newFlag: 0
    })
  },
  ontap: function (e) {
    var that = this;
    var time = this.data.examroom[e.currentTarget.dataset.index].KSSJ;
    var yy = parseInt(time.substring(0, time.indexOf("年")));
    var mm = parseInt(time.substring(5, time.indexOf("月"))) - 1;
    var dd = parseInt(time.substring(time.indexOf("月") + 1, time.indexOf("日")));
    var hh = parseInt(time.substring(time.indexOf("(") + 1, time.indexOf(":")));
    var minute = parseInt(time.substring(time.indexOf(":") + 1, time.indexOf("-")));
    console.log(mm);
    if (mm)
      var targetTime = (new Date(yy, mm, dd, 0, 0, 0)).getTime();
    else
      var targetTime = (new Date(yy, mm, dd, 0, 0, 0)).getTime();
    var currentTime = Date.now();
    var offsetTime = targetTime - currentTime;
    var offsetDays = Math.floor(offsetTime / (3600 * 24 * 1e3)) + 1;
    var offsetHours = Math.floor((offsetTime - offsetDays * (3600 * 24 * 1e3)) / (3600 * 1e3));
    var offsetMinutes = Math.floor((offsetTime - offsetDays * (3600 * 24 * 1e3) - offsetHours * (3600 * 1e3)) / (60 * 1e3));
    var offsetSeconds = Math.floor((offsetTime - offsetDays * (3600 * 24 * 1e3) - offsetHours * (3600 * 1e3) - offsetMinutes * (60 * 1e3)) / (1e3));
    if (offsetDays < 0)
      offsetDays = "已过"
    else if (offsetDays == 0)
      offsetDays = "今天";
    else if (offsetDays < 10)
      offsetDays = offsetDays + "  天";
    else
      offsetDays = offsetDays + "天";
    that.setData({
      floatWindowFlag: 1,
      offsetDays: offsetDays,
      /*offsetHours: offsetHours,
      offsetMinutes: offsetMinutes,
      offsetSeconds: offsetSeconds*/
    });
    /*while(that.data.floatWindowFlag){
      setTimeout(function () {
        var currentTime = Date.now();
        var offsetTime = targetTime - currentTime;
        var offsetDays = Math.floor(offsetTime / (3600 * 24 * 1e3));
        var offsetHours = Math.floor((offsetTime - offsetDays * (3600 * 24 * 1e3)) / (3600 * 1e3));
        var offsetMinutes = Math.floor((offsetTime - offsetDays * (3600 * 24 * 1e3) - offsetHours * (3600 * 1e3)) / (60 * 1e3));
        var offsetSeconds = Math.floor((offsetTime - offsetDays * (3600 * 24 * 1e3) - offsetHours * (3600 * 1e3) - offsetMinutes * (60 * 1e3)) / (1e3));
        that.setData({
          offsetDays: offsetDays,
          offsetHours: offsetHours,
          offsetMinutes: offsetMinutes,
          offsetSeconds: offsetSeconds
        });
      }, 1000);
    }*/
  },
  notontap: function (e) {
    this.setData({
      floatWindowFlag: 0
    })
  }

})