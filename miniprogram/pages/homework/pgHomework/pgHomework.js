// pages/homework/pgHomework/pgHomework.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    size: 1,
    imgList: [],
    textareaAValue: "",

    homeworkDetial: {
      id: 5,
      status: 1,
      studentid: "YA1717177",
      studentname: "杨紫",
      pgstatus: 2,
      stuContext: "更新提示：ZanUI-WeApp 现已升级为 Vant Weapp，Vant Weapp 是有赞移动端组件库 Vant 的小程序版本，两者基于相同的视觉规范，提供一致的 API 接口，助力开发者快速搭建小程序应用。仓库不再维护，请移步至 Vant Weapp 仓库.作者：一斤代码链接：来源：简书著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。",
      stuPic: [],
      score: 99,
      teaRemark:"非常好非常好",

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    var answer = wx.getStorageSync("answer");
    that.setData({
      homeworkDetial: answer,
    })
    console.log(answer);
    
  },


  numberareaAInput(e) {
    this.setData({
      score: e.detail.value
    })
  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },

  //提交批改
  submitscore(e) {
    var that = this;
    console.log(e);
    
    var remarktext = e.currentTarget.dataset.remarktext;
    var score = e.currentTarget.dataset.score;
    console.log(typeof score)
    console.log(remarktext);
    console.log(score);
    if(score==undefined||score==""){
      wx.showModal({
        title: '错误',
        content: '分数未填',
      })
    }else if(score<0 || score>100){
      console.log("scoreerror");
      wx.showModal({
        title: '错误',
        content: '分数取值请在0-100之间',
      })
    }else{
      if (that.data.homeworkDetial.grade!='无'){
        wx.showModal({
          title: '注意',
          content: '重新提交将覆盖上次批改情况，是否继续？',
          confirmText:'是',
          cancelText:'否',
          success: function (res) {
            if (res.cancel) {
              console.log("concel")
              //点击取消,默认隐藏弹框
            } else {
              //点击确定
              wx.request({
                //通过接口获取数据
                url: 'https://andatong.top/wxapp/set_home_grade',
                method: 'POST',
                data: {
                  answer_id: that.data.homeworkDetial.answer_id,
                  grade: that.data.score,
                  content_from_teacher: that.data.textareaAValue
                },
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function (res) {
                  console.log(res);
                  if (res.statusCode == 200 && res.data.status == "success") {
                    wx.showToast({
                      title: '提交成功',
                    })
                    wx.setStorageSync('autoRefreshList', "1");
                    wx.navigateBack({
                      success: function () {}

                    });

                  } else {
                    wx.showModal({
                      title: '出错啦o(╥﹏╥)o',
                      content: '请稍后再试',
                      confirmText: '知道啦',
                      showCancel: false,
                    })
                  }
                },
                complete: function (res) {
                  that.setData({
                    loadModal: false
                  })
                  wx.hideLoading();
                },
              });
            }
          },
          fail: function (res) { },
          complete: function (res) { },//接口调用结束
         
        })
      }else{
        //提交
        wx.request({
          //通过接口获取数据
          url: 'https://andatong.top/wxapp/set_home_grade',
          method: 'POST',
          data: {
            answer_id: that.data.homeworkDetial.answer_id,
            grade: that.data.score,
            content_from_teacher: that.data.textareaAValue
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log(res);
            if (res.statusCode == 200 && res.data.status == "success") {
              wx.showToast({
                title: '提交成功',
              })
              wx.setStorageSync('autoRefreshList', "1");
              wx.navigateBack({
                success: function () { }

              });

            } else {
              wx.showModal({
                title: '出错啦o(╥﹏╥)o',
                content: '请稍后再试',
                confirmText: '知道啦',
                showCancel: false,
              })
            }
          },
          complete: function (res) {
            that.setData({
              loadModal: false
            })
            wx.hideLoading();
          },
        });
        
      }
      console.log(remarktext);
      console.log(score);
    }
  },

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.homeworkDetial.image,
      current: e.currentTarget.dataset.url
    });
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
    var autoRefreshFlag = wx.getStorageSync("autoRefreshFlag");
    if (autoRefreshFlag == 1) {
      wx.setStorageSync('jumpScheduleFlag', '0');
      this.onLoad();
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

  }
})