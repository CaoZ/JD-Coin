// https://m.jr.jd.com/udc-active/2017/liveRedPacket/js/index.js

/* @update: 2017-5-24 17:11:11 */
var $redBtn = $('.redBtn'),
$redPacketBox = $('.redPacket-box'),
$redBox = $('.red-box'),
$success = $('.success'),
$none = $('.none'),
$noneTxt = $('.none-txt'),
isClick = !0,
control = {
  init: function () {
    this.bindEvent()
  },
  bindEvent: function () {
    $redBtn.on('click', function () {
      isClick && (isClick = !1, userDetective.isLogin({
        autoLogin: !0,
        trueFn: function (e) {
          var t = {
            sid: e
          },
          s = {
            activityCode: 'zhibo_xjk'
          };
          $.ajax({
            url: '//ms.jr.jd.com/gw/generic/activity/h5/m/receiveZhiBoXjkRedPacket?reqData=' + JSON.stringify(s),
            type: 'POST',
            data: t,
            dataType: 'json',
            success: function (e) {
              console.log(e),
              isClick = !0,
              3 == e.resultCode ? userDetective.isLogin({
                autoLogin: !0,
                haveLogin: !0
              })  : 0 == e.resultCode ? ($redPacketBox.css('display', 'none'), $redBox.css('display', 'block'), '00' == e.resultData.code ? ($('.emb').addClass('an-zoomIn'), $success.css('display', 'block'), $('.money').text(e.resultData.data), $('.success-tips').text(e.resultData.msg))  : '03' == e.resultData.code ? ($none.css('display', 'block'), $noneTxt.text(e.resultData.msg))  : '04' == e.resultData.code ? ($none.css('display', 'block'), $noneTxt.text(e.resultData.msg))  : '02' == e.resultData.code ? alert('活动未开始/已结束')  : '-1' == e.resultData.code && alert('接口内部异常'))  : e.resultCode == - 1 && alert('重复提交，请不要频繁请求！')
            }
          })
        },
        falseFn: function () {
          userDetective.isLogin({
            autoLogin: !0,
            haveLogin: !0
          })
        }
      }))
    })
  }
};
!function () {
  FastClick && FastClick.attach(document.body),
  control.init()
}();
