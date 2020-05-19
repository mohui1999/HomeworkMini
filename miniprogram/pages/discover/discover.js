// pages/discover/discover.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardCur: 0,

    page: 1,
    size: 1,
    tab: 0,
    newsList: [],
    is_bottom: false,
    is_error: false,
    loadModal: false,
    url: 'https://lzzzzl.top/ahu_article_yuanxi_list',
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'http://xiemenglei.cn/wp-content/uploads/2020/05/A46DC1CBEF10099B.jpg'
    }, 
    {
      id: 1,
      type: 'image',
      url: 'http://xiemenglei.cn/wp-content/uploads/2020/05/BF27C40D2554D65945C90787D8E3F8E7.jpg',
    },
    {
      id: 2,
      type: 'image',
      url: 'http://xiemenglei.cn/wp-content/uploads/2020/05/A612C42F4D19C3DDACF4EF0B59E28AE3.jpg'
    },
     {
      id: 3,
      type: 'image',
       url: 'http://xiemenglei.cn/wp-content/uploads/2020/05/A566404B99BA387F1A2EC112B0A0687B.jpg'
    },
  
    ],

    apps_study: [{
        app_icon: "/icons/discover/classroom.png",
        app_name: "空教室",
        app_type: 0,
        app_url: "/pages/apps/classroom/classroom"
      },
      {
        app_icon: "/icons/discover/score.png",
        app_name: "成绩单",
        app_type: 0,
        app_url: "/pages/apps/newscore/newscore"
      }, {
        app_icon: "/icons/discover/examination_room.png",
        app_name: "考场查询",
        app_type: 0,
        app_url: "/pages/apps/examroom/examroom"
      },

      // {
      //   app_icon: "",
      //   app_name: "",
      //   app_type: 0,
      //   app_url: ""
      // },
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (wx.getStorageSync('studentPW') == "") {
      that.setData({
        loginOrNot: false

      })
    } else {
      that.setData({
        loginOrNot: true,


      })
    }
    this.towerSwiper('swiperList');
    that.getNews();
  },

  getNews: function() {
    var page = this.data.page;
    var that = this;
    if (that.data.showADflag == 0) {
      // wx.showLoading({
      //   title: '正在加载中...',
      // });
      that.setData({
        loadModal: true
      })

    }

    wx.request({
      url: that.data.url,
      data: {
        page: page
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data[0] != undefined) {
          page = page + 1;
          var addData = res.data;
          for (var i = 0; i < addData.length; i++) {
            addData[i].ellipsis = true;
            if (addData[i].excerpt.length >= 300) {
              addData[i].showellipsis = true;
              addData[i].hiddenexcerpt = addData[i].excerpt.substring(0, 300) + "…";
            } else {
              addData[i].showellipsis = false;
              addData[i].hiddenexcerpt = addData[i].excerpt
            }

          }

          //tab=4 
          if (that.data.tab == 4) {
            for (var i = 0; i < addData.length; i++) {
              for (var j = 0; j < addData[i].like_users.length; j++) {
                if (addData[i].like_users[j].author == wx.getStorageSync('studentID')) {
                  addData[i].liked = 1;
                  break;
                }
              }
            }
          }
          var tempData = that.data.newsList;
          for (var i = 0; i < addData.length; i++) {
            tempData.push(addData[i])
          }
          that.setData({
            page: page,
            newsList: tempData
          })
        } else {
          that.setData({
            is_bottom: true,
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {

        that.setData({
          loadModal: false
        })

      },
    })

  },

  //文章展开收起
  excerpt_change: function(e) {
    var that = this;
    console.log(e)
    var index = e.currentTarget.dataset.index;
    var value = !that.data.newsList[index].ellipsis;
    var valuechange = "newsList[" + index + "].ellipsis"
    console.log(index)
    console.log(value)
    this.setData({
      [valuechange]: value,
    })
  },


  // towerSwiper
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },

  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  },

  toStudyApp: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var url = this.data.apps_study[id].app_url
    if (this.data.apps_study[id].app_type == 0) {
      // 跳内部小程序
      if (that.data.loginOrNot == false) {
        wx.showModal({
          title: '未登录',
          content: '请前往我的界面登录并教务认证',
        })
      } else if (wx.getStorageSync("degree") == "JS") {
        wx.showModal({
          title: '提示',
          content: '暂不支持教师用户使用此功能',
        })
      } else {
        wx.navigateTo({
          url: url,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }

    } else if (this.data.apps_study[id].app_type == 1) {
      // 跳外部小程序
      // wx.navigateToMiniProgram({
      //   appId: 'wx4db46bb77c8b03a7',
      //   path: '',
      //   extraData: {},
      //   envVersion: '',
      //   success: function(res) {},
      //   fail: function(res) {},
      //   complete: function(res) {},
      // })
    } else {
      // 跳网页，传送相应的网页url
      // wx.navigateTo({
      //   url: '/pages/webpage/webpage?url=' + url,
      //   success: function(res) {},
      //   fail: function(res) {},
      //   complete: function(res) {},
      // })
      wx.showToast({
        title: '功能正在挖掘中......',
        icon: 'none',
        duration: 1000
      })
    }
  },

  previewImg: function(e) {
    var that = this;
    console.log(e);

    if (that.data.tab == 4) {
      var news_id = e.currentTarget.dataset.newsid;
      //console.log(news_id)
      //var id = e.currentTarget.dataset.id;
      var image = that.data.newsList[news_id].img;
      //console.log(image)
      var imgurl = [];
      imgurl.push(image);
      wx: wx.previewImage({
        current: image,
        urls: imgurl,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
      var news_id = e.currentTarget.dataset.newsid;
      var id = e.currentTarget.dataset.id;
      var image = this.data.newsList[news_id].image;
      wx: wx.previewImage({
        current: image[id],
        urls: image,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
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
    // // 上滑加载更多新闻数据
    this.getNews();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})