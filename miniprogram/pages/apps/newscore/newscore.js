// pages/core/score/score.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 所有课程存储
    score_list: [],

    select: -1,
    score_first: 0,
    // 学年选择
    years: [],
    year: '',
    year_index: '',

    //学期选择
    terms: ['1', '2', '3'],
    term: '',
    term_index: '',

    loadModal: false,


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this;


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function () {
    var that = this;
    // 查看是否存在教务处缓存
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
    } else {
      // if (wx.getStorageSync('score_notice') == "") {
      //   wx.showModal({
      //     title: '提示',
      //     content: '期末查分高峰时段，请尽量减少查询次数，敬请谅解。',
      //   })
      //   wx.setStorageSync("score_notice", 1)
      // }
      var xh = wx.getStorageSync('studentID');
      var pwd = wx.getStorageSync('studentPW');
      that.setData({
        show_login: false,
        xh: xh,
        pwd: pwd
      });
      // 调用获取成绩函数api
      //if (wx.getStorageSync('score_list') == "") {
      //  that.get_cj();
      //}
      wx.getStorage({
        key: 'score_first',
        success: function (res) {
          var score_list = wx.getStorageSync('score_list');
          var scorelength = score_list.length;
          // var yu = score_list.length % 3;

          // 解决未到本学期的问题
          // if (yu == 0) {
          //   var term = 3;
          // } else if (yu == 1) {
          //   var term = 1;
          // } else {
          //   var showlast = 0;
          //   that.setData({
          //     showlast: 0,
          //     scorelength: scorelength,
          //   })
          // }

          that.setData({
            score_list: wx.getStorageSync('score_list'),
            years: wx.getStorageSync('years'),
            year: wx.getStorageSync('year'),
            term: wx.getStorageSync('term'),
            year_index: wx.getStorageSync('score_index'),
            term_index: wx.getStorageSync('term_index'),
            select: wx.getStorageSync('select'),
          });


        },
        fail: function (res) {
          that.get_cj();
        },
        complete: function (res) { }

      });
    }
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

  },

  /*
  获取成绩
  */
  get_cj: function () {
    var that = this;
    var page = that.data.page;
    var xh = that.data.xh;
    var pwd = that.data.pwd;
    var degree = wx.getStorageSync("degree")
    that.setData({
      loadModal: true
    })
    wx.request({
      //通过接口获取数据
      url: 'https://lzzzzl.top/info',
      //url: 'https://lzzzzl.top/info/?user=' + xh + '&password=' + pwd + '&choice=4',
      method: 'POST',
      data: {
        user: xh,
        password: pwd,
        choice: 2,
        degree: degree
      },
      // header: {
      //   'content-type': 'application/json'
      // },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },

      success: function (res) {
        console.log(res);

        if (res.data.error == "empty") {
          wx.showModal({
            title: '暂时未查询到成绩',
            content: '查分高峰期，敬请谅解！',
            showCancel: false,
            confirmText: "知道啦",
            success: function (e) {
              console.log(e)
            }
          })
        } else if (res.data.error == "请先完成评教；对任课教师客观、公正的评价,不仅有益于安徽大学；有益于教师；也有益于你和你学友。") {
          wx.showModal({
            title: '提示',
            content: "请先完成评教；对任课教师客观、公正的评价,不仅有益于安徽大学；有益于教师；也有益于你和你学友。",
            showCancel: false,
            confirmText: "知道啦",
            success: function (e) {
              console.log(e)
            }
          })


        } else {
          var score_list = res.data; //新获得的数据
          console.log(score_list);
          if (res.data.error == undefined) {
            var x, y;
            var arr_xn = [];
            for (x in score_list) {
              var same = 0;
              for (y in arr_xn) {
                if (score_list[x].xn == arr_xn[y]) {
                  same = 1;
                  break;
                } else {
                  same = 0;
                }
              }
              if (same == 0) {
                var new_xn = [score_list[x].xn]; //新获得的数据 cankao
                var old_xn = arr_xn; //之前已经获得的数据
                var arr_xn = old_xn.concat(new_xn); //新旧数据合并
              }
            }

            if (wx.getStorageSync('score_first') != 1) {
              var scorelength = score_list.length;

              that.setData({
                year: "2019-2020",
                select: parseInt(scorelength) - 1,
                term: 1,

              });
              wx.setStorageSync("year", "2019-2020");
              wx.setStorageSync("select", parseInt(scorelength) - 1);
              wx.setStorageSync("term", 1);

            }

            that.setData({
              score_list: score_list,
              years: arr_xn,
              score_first: 1,
            });
            //wx.setStorage('key', 'value')
            wx.setStorageSync("score_list", score_list);
            wx.setStorageSync("years", arr_xn);
            that.setData({
              loadModal: false
            })
            wx.showToast({
              title: '加载成功',
              icon: 'success',
              mask: true
            });

            wx.setStorageSync("score_first", 1);

          }
        }

      },
      fail: function (error) {
        that.setData({
          loadModal: false,
        })
        wx.showModal({
          title: '网络异常',
          content: '请稍后重新加载o(╥﹏╥)o',
          showCancel: false,
          confirmText: "知道啦",
        })
      },
      complete: function (res) {
        wx.hideLoading();
        that.setData({
          loadModal: false,
        })
      }
    });
  },

  // 获取选中值学年
  input_type_year: function (e) {
    var that = this;
    var nowIdx = e.target.dataset.index; //当前点击的索引
    console.log(e)
    var year = that.data.years[e.detail.value];
    console.log('year' + year)
    this.setData({
      year: year,
    });
    var score_list = that.data.score_list;
    for (var x in score_list) {
      if (score_list[x].xn == year) {
        console.log("x" + x)
        var score_index = x
        break
      }
    }
    var count = 0
    for (var y in score_list) {
      if (score_list[y].xn == year) {
        console.log("y" + y)
        count++
      }
    }
    var terms = []
    for (var z = 1; z <= count; z++) {
      var tmp = [z];
      terms = terms.concat(tmp)
    }


    that.setData({
      score_index: score_index,
      count: count,
      terms: terms,
      term: 1,
    })
    var select =
      this.setData({
        select: select,
        score_index: score_index,
      });
    wx.setStorageSync("year", year);
    wx.setStorageSync("select", select);
    wx.setStorageSync("score_index", score_index);
    wx.setStorageSync("term_index", 0);
    wx.setStorageSync("term", 1);

  },

  // 获取学期选中值
  input_type_term: function (e) {
    var that = this;
    var term = that.data.terms[e.detail.value];
    this.setData({
      term: term,
    });
    var score_index = wx.getStorageSync("score_index");
    var term_index = term - 1;
    var select = parseInt(score_index) + term_index;

    console.log(select);
    this.setData({
      term_index: term_index,
      select: select,
    });

    wx.setStorageSync("term", term);
    wx.setStorageSync("term_index", term_index);
    wx.setStorageSync("select", select);
  },

  toAll: function () {
    wx.navigateTo({
      url: '../hiddenscore/hiddenscore',
    })
  },

  score_reload: function (e) {
    var myDate = new Date();
    var nowdate = myDate.getTime()

    if (wx.getStorageSync("olddate") == '') {
      var olddate = 0
    } else {
      var olddate = wx.getStorageSync("olddate")
    }
    var gap = nowdate - olddate

    if (gap <= 5000) {
      wx.showModal({
        title: '提示',
        content: '你刷新的太频繁啦！！！小通通很累哒(╥╯^╰╥)',
      })
    } else {
      wx.setStorageSync("olddate", nowdate)
      this.get_cj();
    }

  }
})