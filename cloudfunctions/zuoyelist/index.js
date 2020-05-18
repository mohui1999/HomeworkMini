// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

var $ = cloud.database().command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection("class").aggregate()
    .lookup({
      from: "student",
      let: {
        classid: '$classid',
      },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$classid', '$$classid']),
          $.eq(['$studentid', 'YA1714192'])
        ])))
        .project({
          _id: 0,
          studentid: 1,
          studentname: 1
        })
        .done(),
      as: 'newstu'
    })
    .end({
      success: function (res) {
        return res;
        console.log(res);
      },
      fail(error) {
        return error;
        console.log("error")
      }
    })
}