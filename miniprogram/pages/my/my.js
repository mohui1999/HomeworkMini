const app = getApp()

Page({
  data: {
    hacky: false, //个人信息开关
    userInfo: {}, //用户微信信息
    hasUserInfo: false, //微信登录开关
    bindFlag: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    avatarUrl: '/icons/my/user-unlogin.png',
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onShow: function () { //初始加载
    var that = this;
    var statusBarHeight = getApp().globalData.statusBarHeight;
    that.setData({
      statusBarHeight: statusBarHeight,
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log("高宽");
        console.log(res.windowHeight);
        console.log(res.windowWidth);
        console.log((res.windowHeight - (res.windowWidth / 750) * 756) / 2);
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          topHeight: (res.windowWidth / 750) * 320 + that.data.statusBarHeight

        })
      }
    })
    if (wx.getStorageSync('studentPW') == "") {
      that.setData({
        bindFlag: 0
      });
    } else {
      that.setData({
        bindFlag: 1
      });
    }
    // if(wx.getStorageSync('jump')==="1"){
    //     wx.showToast({
    //         title: '请先认证教务系统\n然后再使用与教务相关的功能',
    //         icon: 'none',
    //         duration: 2000
    //     });
    //     wx.setStorageSync('jump', '0');
    // }
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = function (res) {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: function (res) {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };
  },

  getUserInfo: function (e) { //获取用户信息
    var that = this;
    console.log(e)
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      that.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
      });
      wx.login({ //登录
        success: function (res) {
          console.log(res.errMsg);
          wx.request({
            url: '' + res.code,
            data: {},
            header: {
              'content-type': 'application/json'
            },
            success: function (res1) {
              var openid = res1.data;
              wx.setStorageSync('openid', openid);
              wx.request({ //检测是否绑定
                url: 'https://windytrees.cn/tied.php?uid=' + openid,
                data: {},
                header: {
                  'content-type': 'application/json'
                },
                success: function (res2) {
                  if (res2.data.code == 1) { //已绑定
                    var username = res2.data.username;
                    wx.setStorageSync('openid', openid);
                    wx.setStorageSync('username', username);
                  }
                }
              });
            },

          })
        }
      })
    }
  },

  toAllHW: function () {
    var that = this;
    if (getApp().globalData.userInfo == null || wx.getStorageSync('studentPW') == "") {
      wx.showModal({
        title: '提示',
        content: '请先"我的"中点击登录并绑定教务！',
        confirmText: '知道啦',
        showCancel: false,
        success: function (res) {

        }
      });
    } else {
      wx.navigateTo({
        //实现跳转的函数，url附带跳转时传送的数据
        url: '/pages/homework/allHomework/allHomework',
      })

    }

  },

  onEnterClass(e){
    if (wx.getStorageSync("studentPW")){
      if (wx.getStorageSync("degree")=='BKS'){
        wx.navigateTo({
          //实现跳转的函数，url附带跳转时传送的数据
          url: '/pages/homework/enterClass/enterClass',
        })
      } else if (wx.getStorageSync("degree") == 'JS'){
        wx.showModal({
          title: '提示',
          content: '教师用户请联系管理员创建班级',
          showCancel:false,
        })
      }
     
    }else{
      wx.showModal({
        title: '提示',
        content: '请先教务认证后再使用',
      })
    }

  },

  toClass: function () {
    if (getApp().globalData.userInfo == null || wx.getStorageSync('studentPW') == "") {
      wx.showModal({
        title: '提示',
        content: '请先"我的"中点击登录并绑定教务！',
        confirmText: '知道啦',
        showCancel: false,
        success: function (res) {

        }
      });
    } else {
      wx.navigateTo({
        //实现跳转的函数
        url: '/pages/homework/myClass/myClass',
      })
    }
  },

  toDetail: function (e) {
    // 意见反馈
    // var url = "https://www.ahutong.com/users/show_linked_article/23";
    // 
    // wx.navigateTo({
    //   url: '/pages/webpage/webpage?url=' + url,
    //   success: function (res) { },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // })
  },

  tofeedback: function () {
    wx.navigateTo({
      url: '/pages/feedback/feedback',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  aboutus: function () { //关于我们
    wx.showModal({
      title: '关于我们',
      content: "【版权所有】\r\nBrainPicker Lab.\r\n\r\n【管理员】\r\n 15056998503（微信）",
      showCancel: false,
      success: function (res) {
        if (res.confirm) { }
      }
    })
  },

  crewlist: function () {
    wx.navigateTo({
      url: '/pages/my/crewlist/crewlist'
    })
  },
  onLib: function () {
    if (!wx.getStorageSync('openid')) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '您尚未登录！',
        success: function (res) {
          if (res.confirm)
            console.log('用户点击确定')
        }
      });
    } else {
      wx.navigateTo({
        url: '/pages/user/binding/binding'
      })
    }
  },
  onShare: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  // onShareAppMessage: function (res) {
  //   if (res.from === 'button') {
  //     qq.showShareMenu({
  //       showShareItems: ['wechatFriends', 'wechatMoment']
  //     })
  //   }
  //   qq.showShareMenu({
  //     showShareItems: ['wechatFriends', 'wechatMoment']
  //   })
  // },
  onSetting: function () {
    wx.navigateTo({
      url: '/pages/my/set/set'
    })
  },
  onBinding: function () {
    if (!this.data.hasUserInfo && this.data.canIUse) {
      wx.showModal({
        title: '提示',
        content: '请先微信授权，再进行教务认证',
      })
    } else {
      wx.navigateTo({
        url: './login/login'
      })

    }

  },
  onDebinding: function () {
    var that = this;
    wx.showModal({
      title: '确认',
      content: '是否要注销教务认证？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('studentPW');
          that.setData({
            bindFlag: 0
          })
        }
      }
    });
  },
 
})