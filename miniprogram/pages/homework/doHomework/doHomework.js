// pages/homework/doHomework/doHomework.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    size: 1,
    imgList: [],
    textareaAValue:"",

    homeworkDetial: {
      id: 5,
      title: "课程第五章",
      proContext: "1.字号大小。一个好的小程序UI界面,首先映入眼帘的就是页面字号大小,下面是眼睛距离与常用的字号大小关系:视距近:30cm以内字号使用:9pt(点)——12pt(点)网...2.色彩设计中讲究形与色的组合, 具体用什么主色调, 要根据小程序的类型来选择, ...3.布局排版布局, 就是小程序内各版块、图标、文字的排列。通过合理的布局, 我们能让访客...4.这些都是新人刚入行的基本小程序UI设计规范, 希望对你有帮助。",
      teacher: "周国强",
      classname: "软件工程",
      time: "2020-05-15 12:00",
      status: 2,
      stuContext: "更新提示：ZanUI-WeApp 现已升级为 Vant Weapp，Vant Weapp 是有赞移动端组件库 Vant 的小程序版本，两者基于相同的视觉规范，提供一致的 API 接口，助力开发者快速搭建小程序应用。仓库不再维护，请移步至 Vant Weapp 仓库.作者：一斤代码链接：来源：简书著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。",
      stuPic: [],
      score: 98,

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
    var Sno = wx.getStorageSync("studentID");
    console.log(Sno)
    
    wx.request({
      //通过接口获取数据
      url: 'https://andatong.top/wxapp/singl_homework_info',
      data: {
        Sno: "Y21614001",
        character: "student",
        homework_id: id,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        that.setData({
          homeworkDetial: res.data,
        })
      }
    })

  },



  //选图片
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '删除图片',
      content: '确定要删除这张图片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },

  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },

  //提交作业
  submitanswer(e){
    console.log(e);
    var stuContext = e.currentTarget.dataset.stucontext;
    var imgList = e.currentTarget.dataset.imglist;
    var filePath= {}
    for(var i=0;i<imgList.length;i++){
      if(i == 0){
        filePath["image1"] = imgList[0];
      } else if(i == 1){
        filePath["image2"] = imgList[1];
      } else if (i == 2) {
        filePath["image3"] = imgList[2];
      }
      
    }

    console.log(stuContext);
    console.log(imgList);
    wx.uploadFile({
      url: 'https://andatong.top/wxapp/upload_img',

      filePath: imgList,
      name: "file",
      formData: {
        "user": "test"
      },

      success(res) {
        console.log("success")
        console.log(res.data)
        var data = res.data;
        var data = JSON.parse(data);
        console.log(data)
        that.setData({
          img_path: data[0].img_path,
        })
        wx.request({
          //通过接口获取数据
          url: 'https://lzzzzl.top/AHU_community/useraction',
          method: 'POST',
          data: {
            OnsUha: wx.getStorageSync('studentID'),
            userAvatar: getApp().globalData.userInfo.avatarUrl,
            excerpt: that.data.textContent,
            img: that.data.img_path,
            wx_name: getApp().globalData.userInfo.nickName,
            position: that.data.position,
            choice: that.data.choice,
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log(res);
            if (res.statusCode == 200 && res.data.status == "success") {
              wx.setStorageSync('autoRefreshList', "1");
              wx.navigateBack({
                success: function () {
                  wx.removeStorageSync('alllocation');
                  wx.removeStorageSync('chooseposition');
                  wx.removeStorageSync('positionindex');
                }

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
          },
        });




      },
      fail: function (res) {

        var data = JSON.parse(res.data);
        console.log("fail")
        console.log(data)
        wx.showModal({
          title: "图片上传失败",
          content: "请检查网络稍后再试吧",
          showCancel: false,
          confirmText: "确定"
        })
      }

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