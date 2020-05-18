// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

var $ = cloud.database().command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection("class").aggregate()
    .lookup({
      from: "student",
      localField: 'classid',
      foreignField: 'classid',
      as: 'newstu'
    })
    .lookup({
      from: "teacher",
      localField: 'classid',
      foreignField: 'classid',
      as: 'newtea'
    })
    .lookup({
      from: "homework",
      localField: 'classid',
      foreignField: 'classid',
      as: 'newhome'
    })
    .lookup({
      from: "stuanswer",
      localField: 'classid',
      foreignField: 'classid',
      as: 'newans'
    })
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$newstu', 0]), $.arrayElemAt(['$newtea', 0]), $.arrayElemAt(['$newhome', 0]), $.arrayElemAt(['$newans', 0]), '$$ROOT'])
    })
    .project({
      newstu: 0,
      newtea: 0,
      newhome:0,
      newans:0
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


// 云函数入口函数
// exports.main = async (event, context) => {
//   const wxContext = cloud.getWXContext()

//   return {
//     event,
//     openid: wxContext.OPENID,
//     appid: wxContext.APPID,
//     unionid: wxContext.UNIONID,
//   }
// }