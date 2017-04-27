// https://m.jr.jd.com/spe/qyy/main/js/main.min.js

'use strict';
!function (a) {
  a.tools = {
    beReqdata: function (b) {
      return {
        reqData: JSON.stringify(b),
        sid: a.tools.getSid(),
        source: a.tools.getSource()
      }
    },
    isQyyOut: function () {
      return a.tools.getString('userType') ? !1 : !0
    },
    getSource: function () {
      return a.tools.isApp() ? 'app' : 'jrm'
    },
    hasDom: function (a) {
      return 0 === a.length ? !1 : !0
    },
    getFractionToDecimal: function (a) {
      var b = '';
      return - 1 != a.indexOf('%') ? (b = a.split('%'), b[0] / 100)  : (b = a.split('/'), b[0] / b[1])
    },
    getString: function (a) {
      var b = new RegExp('(^|&)' + a + '=([^&]*)(&|$)', 'i'),
      c = window.location.search.substr(1).match(b);
      return null != c ? decodeURIComponent(c[2])  : null
    },
    getSid: function () {
      return a.tools.isApp() ? a.tools.getString('token') || a.tools.getString('sid') || a.tools.getCookie('sid')  : a.tools.getString('sid') || a.tools.getCookie('sid')
    },
    hasSid: function () {
      var b = a.tools.getSid();
      return null === b || '' === b ? !1 : !0
    },
    changeToNumber: function (a) {
      return 'string' == typeof a ? Number(a)  : a
    },
    changeToBoolean: function (a) {
      return 'boolean' == typeof a ? Boolean(a)  : a
    },
    getCookie: function (a, b) {
      b = b || {
      };
      var c,
      d = b.raw ? function (a) {
        return a
      }
       : decodeURIComponent;
      return (c = new RegExp('(?:^|; )' + encodeURIComponent(a) + '=([^;]*)').exec(document.cookie)) ? d(c[1])  : null
    },
    newSetCookie: function (b, c, d) {
      if (d = a.extend({
      }, {
        domain: 'jr.jd.com',
        path: '/'
      }, d), null === c && (d.expires = - 1), 'number' == typeof d.expires) {
        var e = d.expires,
        f = d.expires = new Date;
        f.setTime(f.getTime() + 1000 * e * 60 * 60)
      } else if ('24h' === d.expires) {
        var g = new Date,
        f = g.getTime(),
        h = g.getHours(),
        i = g.getMinutes(),
        j = g.getSeconds(),
        k = '';
        k = f - 60 * h * 60 * 1000 - 60 * i * 1000 - 1000 * j + 86400000,
        k = new Date(k),
        d.expires = k.toUTCString()
      }
      return c = '' + c,
      document.cookie = [
        b,
        '=',
        d.raw ? c : c,
        d.expires ? '; expires=' + d.expires : '',
        d.path ? '; path=' + d.path : '',
        d.domain ? '; domain=' + d.domain : '',
        d.secure ? '; secure' : ''
      ].join('')
    },
    setCookie: function (b, c, d) {
      if (d = a.extend({
      }, {
        domain: 'jr.jd.com',
        path: '/'
      }, d), null === c && (d.expires = - 1), 'number' == typeof d.expires) {
        var e = d.expires,
        f = d.expires = new Date;
        f.setTime(f.getTime() + 1000 * e * 60 * 60)
      }
      return c = '' + c,
      document.cookie = [
        b,
        '=',
        d.raw ? c : c,
        d.expires ? '; expires=' + d.expires.toUTCString()  : '',
        d.path ? '; path=' + d.path : '',
        d.domain ? '; domain=' + d.domain : '',
        d.secure ? '; secure' : ''
      ].join('')
    },
    isChinese: function (a) {
      var a = a.replace(/(^\s*)|(\s*$)/g, '');
      return !/^[\u4E00-\uFA29]*$/.test(a) || /^[\uE7C7-\uE7F3]*$/.test(a) ? !1 : !0
    },
    hasChinese: function (a) {
      var b = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
      return b.test(a)
    },
    isApp: function () {
      var a = navigator.userAgent.toLowerCase();
      return 'jdjr-app' == a.match(/jdjr-app/i) ? !0 : !1
    },
    clearCookie: function () {
    },
    isQQ: function () {
      var a = navigator.userAgent.toLowerCase(),
      b = /sq/.test(a);
      return b
    },
    isJDApp: function () {
      var a = navigator.userAgent.toLowerCase();
      return 'jdapp' == a.match(/jdapp/i) ? !0 : !1
    },
    isIos: function () {
      var a = /(iPhone|iPad|iPod)/i.test(navigator.userAgent);
      return a
    },
    isWeiXin: function () {
      var a = window.navigator.userAgent.toLowerCase();
      return 'micromessenger' == a.match(/MicroMessenger/i) ? !0 : !1
    },
    isPc: function () {
      for (var a = navigator.userAgent, b = new Array('Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'), c = !0, d = 0; d < b.length; d++) if (a.indexOf(b[d]) > 0) {
        c = !1;
        break
      }
      return c
    },
    checkIosVersion: function () {
      var a = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),
      b = parseInt(a[1]),
      c = parseInt(a[2]),
      d = parseInt(a[3]),
      e = [
        b,
        c,
        d
      ];
      return e
    },
    checkIos10_2_1: function () {
      if (a.tools.isIos()) {
        var b = a.tools.checkIosVersion(),
        c = b[0],
        d = b[1];
        return c >= 10 && d >= 2 ? !0 : !1
      }
      return !1
    },
    getClientType: function () {
      var a = '';
      return 1 == tools.checkUrlStatus() ? a = 8 : tools.isWeiXin() ? a = 3 : tools.isJDApp() ? (a = 5, tools.isIos() || (a = 7))  : a = tools.isApp() ? 2 : tools.isPc() ? 1 : 4,
      a
    },
    checkUrlStatus: function () {
      var a = 0,
      b = location.origin,
      c = 'http://m.jr.jd.com',
      d = 'https://m.jr.jd.com',
      e = 'http://minner.jr.jd.com';
      return a = b == c ? 0 : b == d ? 0 : b == e ? 10 : 2
    },
    isEmptyObject: function (a) {
      return '{}' == JSON.stringify(a)
    },
    jointUrlParam: function (a, b, c) {
      var d = new RegExp('/?/');
      return d.test(a) ? a + '&' + b + '=' + c : a + '?' + b + '=' + c
    },
    transmitParam: function (a, b, c, d, e) {
      return a.test(c) ? tools.jointUrlParam(d, b, e)  : d
    },
    getDeviceId: function () {
      function b(a) {
        var b = new RegExp('(^|&)' + a + '=([^&]*)(&|$)', 'i'),
        d = c.substr(1).match(b);
        return null != d ? decodeURIComponent(d[2])  : null
      }
      var c = navigator.userAgent;
      c = c.replace(/\;/g, '&'),
      c = c.replace(/\//g, '=');
      var d = null;
      return a.tools.isIos() ? d = b('adid') || b('deviceid')  : (d = b('deviceid'), null === d && (d = b('uid'))),
      d
    },
    forbidScroll: function () {
      document.body.style.overflow = 'hidden'
    },
    permitScroll: function () {
      document.body.style.overflow = 'auto'
    },
    passportLogin: function () {
      var a = tools.getString('sid');
      '' === a && null === a && (window.location.href = qyy.links.mLogin + encodeURIComponent(location.origin + location.pathname))
    },
    jdjrAppLogin: function () {
      var a = tools.getString('token');
      '' === a && null === a && jsBridgeV3.onReady().then(function () {
        this.jsToGetResp(function (a) {
          a = 'object' == typeof a ? a : JSON.parse(a),
          a.data && (window.location.href = location.origin + location.pathname + '?token=' + decodeURIComponent(a.data))
        }, {
          type: 1,
          data: ''
        })
      })
    },
    unifyLogin: function () {
      this.isApp() ? this.jdjrAppLogin()  : this.passportLogin()
    },
    loadSource: function (a, b, c, d) {
      if (null === document.getElementById(c)) {
        var e = document.createElement(b);
        e.src = a,
        e.id = c,
        document.getElementsByTagName('body') [0].appendChild(e),
        document.getElementById(c).onload = function () {
          void 0 != d && d()
        }
      }
    },
    checkHost: function (a) {
      var b = location.host,
      c = function () {
        return 'link' === a ? !0 : 'interface' === a ? !1 : !0
      }();
      switch (b) {
        case 'm.jr.jd.com':
          return c ? 'm' : 'ms';
        case 'minner.jr.jd.com':
          return c ? 'minner' : 'msinner';
        case 'localhost:8080':
          return c ? 'minner' : 'msinner';
        default:
          return c ? 'm' : 'ms'
      }
    },
    dealSystemError: function () {
      var b = a('#system-error-wrap'),
      c = a('#system-error-reload');
      b.removeClass('hide'),
      a.tools.forbidBodyScroll(),
      c.click(function () {
        location.reload()
      })
    },
    forbidBodyScroll: function () {
      document.getElementsByTagName('body') [0].style['overflow-y'] = 'hidden'
    }
  },
  a.jdjr = {
    getSid: function () {
      var b = a.tools.getString('sid');
      return '' === b || null === b ? !1 : !0
    },
    getToken: function () {
      var b = a.tools.getString('token');
      return '' === b || null === b ? !1 : !0
    }
  }
}(Zepto);
var qyy = {
  $obj: {
    html: $('html'),
    body: $('body'),
    wrap: $('.wrap'),
    dataInput: $('#qyy-data-input')
  },
  tabProducts: {
    skuMenuMap: [
    ],
    skuMenuItemMap: [
    ]
  },
  isEnterInLoaing: !0,
  isJrUser: !1,
  isQyyOut: $.tools.isQyyOut(),
  isStatic: 'static' === $('html').data('type') ? !0 : !1,
  sid: $.tools.getSid(),
  hasSid: $.tools.hasSid(),
  token: $.tools.getString('token'),
  isIos: $.tools.isIos(),
  isInApp: $.tools.isApp(),
  isInJdApp: $.tools.isJDApp(),
  isInWeixin: $.tools.isWeiXin(),
  isInQQ: $.tools.isQQ(),
  userType: parseInt($.tools.getString('userType')) || $('#qyy-usertype').attr('data-qyy-usertype'),
  isActionErr: !1,
  isReturnTop: 0,
  needLogin: !1,
  isLogin: !1,
  inAppLoginInFlag: !0,
  headerTitle: '',
  hasFixedTop: !1,
  hasComFixedTop: !1,
  fixedTopSeizeClass: '',
  hasFixedBottom: !1,
  canChangeAppColor: !0,
  protocol: location.protocol
};
qyy.imgHost = qyy.protocol + '//m.jr.jd.com/spe/qyy/main/',
qyy.links = {
  mLogin: qyy.protocol + '//passport.m.jd.com/user/login.action?v=t&sid=&returnurl=',
  imgPlaceHoldUrl: qyy.protocol + '//img12.360buyimg.com/jrpmobile/jfs/t2392/247/2876588652/1253/b393637/5719d996N2f175f2f.jpg',
  defaultHeaderImg: qyy.protocol + '//img12.360buyimg.com/jrpmobile/jfs/t2644/238/1420176553/1442/96e2885/573d96deN06201af5.png',
  xbxyIcon: qyy.protocol + '//m.jr.jd.com/spe/qyy/main/images/icon_xbxy.png',
  checkName: 'https://msc.jd.com/auth/loginpage/wcoo/toAuthPage?' + (qyy.isInApp ? 'source=1&businessType=69' : 'source=4&businessType=68') + '&sid=',
  checkNameV1: 'https://msc.jd.com/auth/loginpage/wcoo/toAuthPage?' + (qyy.isInApp ? 'source=1&businessType=344' : 'source=2&businessType=344') + '&directReturnUrl=' + encodeURIComponent(location.href),
  jimuQb: '//m.jr.jd.com/mjractivity/14757-3.html?sid=',
  xjk: qyy.protocol + '//ms.jr.jd.com/xjk/h5/xjk/onekeyredirect.action?sid=',
  acZhye: qyy.protocol + '//m.jdpay.com/wallet/login/sid?toUrl=' + encodeURIComponent(qyy.protocol + '//m.jdpay.com/wallet/balance/index.htm?style=normal') + '&sid='
},
qyy.statics = {
  jrlogo: qyy.protocol + '//m.jr.jd.com/statics/logo.jpg',
  successIcon: qyy.protocol + '//m.jr.jd.com/statics/images/success@100.png',
  errorIcon: qyy.protocol + '//m.jr.jd.com/statics/images/error@100.png'
},
qyy.resource = {
  vip: 'js/vip/vip.js',
  balance: 'js/balance/balance.js'
},
qyy.wangGuan = qyy.protocol + '//' + $.tools.checkHost('interface') + '.jr.jd.com/gw/generic/base/h5/m/',
qyy.actionMap = {
  getAllInfo: qyy.wangGuan + 'baseGetOutH5MessageList',
  baseGetMessByGroupTypeEncrypt: qyy.wangGuan + 'baseGetMessByGroupTypeEncrypt',
  baseGetMessByGroupType: qyy.wangGuan + 'baseGetMessByGroupType',
  getPageInfo: qyy.wangGuan + 'baseOutH5Page',
  outH5ReceiveMission: qyy.wangGuan + 'baseOutH5ReceiveMission',
  outH5RewardMission: qyy.wangGuan + 'baseOutH5RewardMission',
  getMissionAwardlist: qyy.wangGuan + 'baseGetMissionAwardlist',
  getMissionDetail: qyy.wangGuan + 'baseGetMissionDetailEncrypt',
  baseSignInEncrypt: qyy.wangGuan + 'baseSignInEncrypt',
  qyyExposure: '//jrmfp.jr.jd.com/hpvuv'
},
function (a) {
  var b = {
    setTitleRight: function () {
    },
    inAppUnifyLogin: function (a) {
      jsBridgeV3.onReady().then(function () {
        this.jsOpenWeb({
          jumpUrl: a,
          jumpType: 8,
          productId: '',
          isclose: !1
        })
      })
    },
    unifyAppLogin: function () {
      var a = location.href;
      qyy.inAppLoginInFlag = !1,
      qyy.isInApp ? jsBridgeV3.onReady().then(function () {
        this.jsOpenWeb({
          jumpUrl: a,
          jumpType: 8,
          productId: '',
          isclose: !0
        })
      })  : location.href = qyy.links.mLogin + a
    },
    changeJrAppColor: function (a) {
      jsBridgeV3.onReady().then(function () {
        this.jsToGetResp(function () {
        }, {
          type: 3,
          colorArr: a.colorArr
        }),
        void 0 != a.btnText && this.jsToNaWeiXin({
          isShow: !0,
          optionType: 2,
          btnText: a.btnText,
          jumpLiDate: {
            isLogin: 2,
            jumpLink: a.jumpLink,
            isclose: !1
          }
        })
      })
    },
    initJrAppShare: function (a, b, c, d, e) {
      jsBridgeV3.onReady().then(function () {
        this.jsToNaWeiXin({
          isShow: !0,
          optionType: 1,
          btnText: '分享',
          jumpLiDate: {
            isLogin: 0,
            jumpLink: '',
            isclose: !1
          },
          jumpNaDate: {
            type: 7,
            productId: 71824013,
            isclose: !1
          },
          shareDate: {
            appId: '',
            img: e,
            link: d,
            desc: c,
            title: a,
            friendesc: a,
            type: 3475734
          }
        })
      })
    },
    initWeixinShare: function (a, b, c, d, e) {
      var f = {
        appId: '',
        imgUrl: e,
        link: d,
        desc: c,
        title: a
      };
      WeixinApi.ready(function (a) {
        var b = {
          ready: function () {
          },
          cancel: function () {
          },
          fail: function () {
          },
          confirm: function () {
          },
          all: function () {
          }
        };
        a.shareToFriend(f, b),
        a.shareToWeibo(f, b),
        a.shareToTimeline(f, b)
      })
    },
    initJdAppShare: function (a, b, c, d, e) {
      var f = encodeURIComponent(d),
      g = e;
      try {
        var h = {
        },
        i = [
        ];
        i[0] = a,
        i[1] = b,
        i[2] = f,
        i[3] = g,
        h.version = navigator.userAgent.split(';'),
        h.isInApp = 'jdapp' == h.version[0].toLowerCase(),
        h.isRightVersion = h.isInApp && h.version[2].replace(/\./g, '') >= 400,
        h.isRightVersion && ('iphone' == h.version[1].toLowerCase() ? location.href = 'openapp.jdmobile://communication?params={"action":"syncShareData","title":"' + i[0] + '","content":"' + i[1] + '","shareUrl":"' + i[2] + '","iconUrl":"' + i[3] + '"}' : 'android' == h.version[1].toLowerCase() && shareHelper.setShareInfo(i[0], i[1], d, i[3]))
      } catch (j) {
      }
    },
    init: function () {
    }
  };
  a.communication = b
}(window, Zepto),
function (a, b) {
  function c(a, b, c) {
    this.countDownId = a,
    this.endTime = b,
    this.position = c,
    this.needClear = !1,
    this.formatDateStr = function (a) {
      return 0 >= a ? a = '00' : a > 0 && 10 > a && (a = '0' + a),
      a
    },
    this.initDom = function () {
      var a = new Date,
      b = 0,
      d = 0,
      e = 0,
      f = 0,
      g = 0;
      a = a.getTime(),
      b = this.endTime - a,
      0 >= b ? (d = e = f = g = '00', this.needClear = !0)  : (d = Math.floor(b / 1000 / 60 / 60 / 24), e = Math.floor(b / 1000 / 60 / 60 % 24), f = Math.floor(b / 1000 / 60 % 60), g = Math.floor(b / 1000 % 60), e = this.formatDateStr(e + 24 * d), f = this.formatDateStr(f), g = this.formatDateStr(g));
      var h = '<div><span>' + e + '</span><strong>:</strong><span>' + f + '</span><strong>:</strong><span>' + g + '</span></div>';
      c.find('div').remove(),
      c.append(h)
    },
    this.init = function () {
      this.initDom()
    }
  }
  function d(a, c) {
    function d() {
      g.scrollTop = 0,
      setInterval(e, 15)
    }
    function e() {
      f || (i += 1, 37 == i ? (j += 1, i -= 1, 180 == j && (i = 0, j = 0))  : (h = g.scrollTop, g.scrollTop += 1, h == g.scrollTop && (g.scrollTop = 0, g.scrollTop += 1)))
    }
    try {
      var f = !1,
      g = document.getElementById(a);
      g.onmouseover = new Function('isStoped = true'),
      g.onmouseout = new Function('isStoped = false');
      var h = 0,
      i = 0,
      j = 0,
      k = (document.getElementById(c), b(document.getElementById(c)).find('ul')),
      l = k.find('li:first-child').clone();
      k.append(l),
      d()
    } catch (m) {
    }
  }
  a.CountDown = c,
  a.scrollNotice = d
}(window, Zepto),
function (a, b) {
  function c() {
    var a = encodeURIComponent(b.tools.getString('qingfrom'));
    return (null === a || '' === a) && (a = 0),
    a
  }
  var d = b.tools,
  e = {
    pixel_1: + qyy.imgHost + 'images/pixel_1.jpg',
    pixel_2: + qyy.imgHost + 'images/pixel_2.jpg',
    pixel_3: + qyy.imgHost + 'images/pixel_3.jpg',
    placeHolderImg: '//img12.360buyimg.com/jrpmobile/jfs/t1903/15/2856573526/1979/8296dea9/571d99a4Nea2597e4.png',
    qingfrom: c(),
    resetClstag: function (a) {
      var b = a.split('_'),
      c = [
      ];
      return c[0] = 'Qing_' + b[1] + '_' + b[2],
      c[1] = b[3] + '_' + b[4],
      c
    },
    getGroupBottom: function (a) {
      return 1 == a ? 'hasPadding' : ''
    },
    getPageClick: function (a, b) {
      var c = '',
      f = '';
      if (b.floorOutH5Point) f = e.resetClstag(b.floorOutH5Point),
      c = 'jrmsc="on" data-qyy-click="" clstag="pageclick|keycount|' + f[0] + '|' + f[1] + '|' + a + '" data-qyy-ejumpType=' + b.fjumpType + ' data-qyy-jumpt="' + b.fjumpUrl + '"';
       else if (b.mLink) {
        var g = d.isApp() ? b.jrAppLink : b.mLink;
        f = e.resetClstag(b.outH5Point),
        c = 'jrmsc="on" data-qyy-click="" clstag="pageclick|keycount|' + f[0] + '|' + f[1] + '|' + a + '" data-qyy-ejumpType=1 data-qyy-jumpt="' + g + '"'
      } else f = e.resetClstag(b.outH5Point),
      c = 'jrmsc="on" data-qyy-click="" clstag="pageclick|keycount|' + f[0] + '|' + f[1] + '|' + a + '" data-qyy-ejumpType=' + b.ejumpType + ' data-qyy-jumpt="' + b.ejumpUrl + '"';
      return c
    },
    getRowTitile: function (a) {
      var b = 'com-desc',
      c = 'com-title';
      ('' === a.fsubtitle || '' === a.fjumpUrl) && (b = 'com-desc bg-none'),
      '' === a.fsubtitle && (c = 'com-title maxWidth100'),
      1 === a.fTitlePosition && (c = 'com-title center');
      var d = '<div class="row row-title" ' + e.getPageClick(e.qingfrom, a) + '><div class="' + c + '" style="color:' + a.ftitleColor + '"">' + a.ftitle + '</div><div class="' + b + '" style="color:' + a.fsubtitleColor + '"">' + a.fsubtitle + '</div></div>';
      return d
    },
    getFloor: function (a) {
      var b = 0 === a.fbackgroundBorder ? 'hasPadding' : '',
      c = [
        'noFloorBottom',
        'hasFloorBottom',
        'hasFloorBottomLine'
      ],
      d = a.floorType,
      e = '';
      if (124 === d || 125 === d) {
        qyy.tabProducts.skuMenuMap.push(qyy.tabProducts.skuMenuItemMap),
        qyy.tabProducts.skuMenuItemMap = [
        ];
        var f = {
          124: 'jd-sku',
          125: 'zc-sku'
        };
        e = '<div class="section section-' + d + ' ' + b + ' ' + a.hasFloorTitleTopPadding + ' ' + c[a.fbottomMargin] + '" style="background:' + a.fbackgroundColor + '">' + a.floorTitleStr + '<div class="row row-' + d + ' ' + f[d] + ' swiper-container-focus product-sku"><div class="swiper-pagination"></div><div class="swiper-wrapper">' + a.floorStr + '</div></div></div></div>'
      } else 45 === d ? (qyy.hasComFixedTop = !0, qyy.fixedTopSeizeClass = c[a.fbottomMargin], e = '<div class="section section-' + d + '" style="background:' + a.fbackgroundColor + '">' + a.floorTitleStr + a.floorStr + '</div>')  : e = 132 === d ? '<div class="section section-' + d + ' ' + b + ' ' + a.hasFloorTitleTopPadding + ' ' + c[a.fbottomMargin] + '" style="background:' + a.fbackgroundColor + '">' + a.floorTitleStr + a.floorStr + '</div>' : '<div class="section section-' + d + ' ' + b + ' ' + a.hasFloorTitleTopPadding + ' ' + c[a.fbottomMargin] + '" style="background:' + a.fbackgroundColor + '">' + a.floorTitleStr + a.floorStr + '</div>';
      return e
    },
    getFocusElement: function (a) {
      var b = '<div class="swiper-slide" ' + e.getPageClick(e.qingfrom, a) + '><div class="img-wrap"><img src="" class="test-lazyload" data-qyy-original="' + a.eproductImgA + '" alt=""></div><p class="title" style="color:' + a.etitle1Color + '">' + a.etitle1 + '</p><p class="desc" style="color:' + a.etitle2Color + '">' + a.etitle2 + '</p></div>';
      return b
    },
    getFocusGroup: function (a, b) {
      var c = '<div class="row focus"><div class="swiper-container swiper-container-focus ' + e.getGroupBottom(b.bottomMargin) + '"><div class="swiper-wrapper">' + a + '</div><div class="swiper-pagination"></div></div></div>';
      return c
    },
    getBannerElement: function (a) {
      var b = '<div class="swiper-slide" ' + e.getPageClick(e.qingfrom, a) + '><div class="img-wrap"><img src="" class="test-lazyload" data-qyy-original="' + a.eproductImgA + '" alt="" ejumpUrl=' + a.ejumpUrl + '></div><p class="title" style="color:' + a.etitle1Color + '">' + a.etitle1 + '</p><p class="desc" style="color:' + a.etitle2Color + '">' + a.etitle2 + '</p></div>';
      return b
    },
    getBannerGroup: function (a, b) {
      var c = '<div class="row block-slider banner ' + e.getGroupBottom(b.bottomMargin) + '"><div class="swiper-container swiper-container-banner"><div class="swiper-wrapper">' + a + '</div></div></div>';
      return c
    },
    getSingleProductElement: function (a) {
      var b = '<div class="swiper-slide" ' + e.getPageClick(e.qingfrom, a) + '><img class="place-holder" src=' + e.placeHolderImg + '><p class="title" style="color:' + a.etitle1Color + '">' + a.etitle1 + '</p><p class="rate" style="color:' + a.etitle2Color + '">' + a.etitle2 + '</p><p class="rate-desc style="color:' + a.etitle3Color + '"">' + a.etitle3 + '</p><p class="date" style="color:' + a.etitle4Color + '">' + a.etitle4 + '</p><p class="date-desc">' + a.extData + '</p></div>';
      return b
    },
    getSingleProductGroup: function (a, b) {
      var c = '<div class="row block-slider single ' + e.getGroupBottom(b.bottomMargin) + '"><div class="swiper-container swiper-container-single"><div class="swiper-wrapper">' + a + '</div></div></div>';
      return c
    },
    getImgProductElement: function (a) {
      var b = '<div class="swiper-slide" ' + e.getPageClick(e.qingfrom, a) + '><div class="img-wrap"><img src="" class="test-lazyload" data-qyy-original="' + a.eproductImgA + '" alt="" ejumpUrl=' + a.ejumpUrl + '></div><p class="title" style="color:' + a.etitle1Color + '">' + a.etitle1 + '</p><p class="desc" style="color:' + a.etitle2Color + '">' + a.etitle2 + '</p></div>';
      return b
    },
    getImgProductGroup: function (a, b) {
      var c = '<div class="row block-slider ImgProduct ' + e.getGroupBottom(b.bottomMargin) + '"><div class="swiper-container swiper-container-ImgProduct"><div class="swiper-wrapper">' + a + '</div></div></div>';
      return c
    },
    getObjectElement: function (a) {
      var b = '<div class="swiper-slide" ' + e.getPageClick(e.qingfrom, a) + '><img class="place-holder" src=' + e.placeHolderImg + '><p class="title" style="color:' + a.etitle1Color + '">' + a.etitle1 + '</p><div class="img-wrap"><img class="img test-lazyload" src="" data-qyy-original="' + a.eproductImgA + '" alt=""></div><p class="price" style="color:' + a.etitle2Color + '">' + a.etitle2 + '</p><p class="zc-date" style="color:' + a.etitle3Color + '">' + a.etitle3 + '</p></div>';
      return b
    },
    getObjecttGroup: function (a, b) {
      var c = '<div class="row block-slider zc ' + e.getGroupBottom(b.bottomMargin) + '"><div class="swiper-container swiper-container-single"><div class="swiper-wrapper">' + a + '</div></div></div>';
      return c
    },
    getSingleIconElement: function (a) {
      for (var b = '', c = a.length, d = 0; c > d; d++) {
        var f = '<div class="img-wrap"><img src="" class="icon test-lazyload" data-qyy-original=' + a[d].eproductImgA + ' alt=""></div>';
        '' === a[d].eproductImgA && (f = '<span class="img-position"></span>'),
        b += '<div class="item" ' + e.getPageClick(e.qingfrom, a[d]) + ' style="background:' + a[d].ebackgroundColor + '">' + f + '<span class="title" style="color:' + a[d].etitle1Color + '">' + a[d].etitle1 + '</span><span class="desc" style="color:' + a[d].etitle2Color + '">' + a[d].etitle2 + '</span></div>'
      }
      return b
    },
    getSingleIconGroup: function (a, b) {
      var c = '<div class="row menu ' + e.getGroupBottom(b.bottomMargin) + '">' + a + '</div>';
      return c
    },
    getDoubleAndIconElement: function (a) {
      var b = '<span class="name" style="color:' + a.etitle1Color + ';line-height:auto">' + a.etitle1 + '</span>',
      c = '',
      d = 'row classify singleTitle',
      f = 'benifit',
      g = a.elementType;
      41 === g && (f = 'classify-user-check'),
      42 === g && (f = 'classify-user-tel'),
      '' != a.etitle2 && (b = '<span class="name" style="color:' + a.etitle1Color + ';line-height:1.8">' + a.etitle1 + '</span>', c = '<span class="desc" style="color:' + a.etitle2Color + '">' + a.etitle2 + '</span>', d = 'row classify');
      var h = '<div class="' + d + '" ' + e.getPageClick(e.qingfrom, a) + '><div class="icon"><div class="img-wrap"><img src="" class="test-lazyload" data-qyy-original="' + a.eproductImgA + '" alt=""></div></div><div class="info">' + b + c + '</div><div class="benifit" id="qyy-' + f + '" style="color:' + a.etitle3Color + '">' + a.etitle3 + '</div></div>';
      return h
    },
    getDoubleAndIconGroup: function (a) {
      var b = a;
      return b
    },
    getRowBannerElement: function (a) {
      var b = '<div class="img-wrap"><img src="" class="test-lazyload check-load-status" data-qyy-original="' + a.eproductImgA + '" alt="" ' + e.getPageClick(e.qingfrom, a) + '></div>';
      return b
    },
    getRowBannerGroup: function (a, b) {
      var c = '<div class="row whole-banner ' + e.getGroupBottom(b.bottomMargin) + '">' + a + '</div>';
      return c
    },
    getZcNewsElement: function (a) {
      var b = '<div class="article" ' + e.getPageClick(e.qingfrom, a) + '><div class="info"><p class="title" style="color:' + a.etitle1Color + '">' + a.etitle1 + '</p><div class="more"><span class="author" style="color:' + a.etitle2Color + '">' + a.etitle2 + '</span><span class="label" style="color:' + a.etitle4Color + '">丨' + a.etitle4 + '</span></div></div><div class="img-wrap"><img src="" class="img test-lazyload" data-qyy-original="' + a.eproductImgA + '" alt=""></div></div>';
      return b
    },
    getZcNewsGroup: function (a, b) {
      var c = '<div class="row ' + e.getGroupBottom(b.bottomMargin) + '">' + a + '</div>';
      return c
    },
    getMemberInfoElement: function (a) {
      var b = '';
      return 1 === a.elementType ? b = '<img class="header" src="' + qyy.links.defaultHeaderImg + '" alt=""><div class="info"><div class="name"></div>' : 3 === a.elementType ? b = '<div class="xiaobai" ' + e.getPageClick(e.qingfrom, a) + '><img class="xiaobai-icon" src="' + qyy.links.xbxyIcon + '" alt=""><span id="qyy-xbxy-title"></span></div></div>' : 2 === a.elementType && (b = '<div class="qiandao" ' + e.getPageClick(e.qingfrom, a) + '><img class="qiandao-icon shake" id="qyy-qiandao-icon" src="' + a.eproductImgA + '" alt=""><div class="qiandao-title" style="color:' + a.etitle1Color + '">' + a.etitle1 + '</div></div>'),
      b
    },
    getMemberInfoGroup: function (a, b) {
      var c = '<div class="row row-' + b.groupType + ' member-user ' + e.getGroupBottom(b.bottomMargin) + '">' + a + '</div>';
      return c
    },
    getMemberMissionElement: function (a) {
      var c = '';
      if (0 === a.elementType) c = '<div class="member-mission-all-title">— ' + a.areaShowName + ' —</div>';
       else {
        var d = a.scheduleTargetValue,
        f = a.scheduleShowValue,
        g = a.frequencyType,
        h = a.status,
        i = (a.areaShow, a.tag),
        j = '',
        k = '',
        l = 0,
        m = h,
        n = {
        },
        o = '',
        p = '',
        q = '',
        n = {
          '-2': '不可领取',
          '-1': '未领取任务',
          0: '进行中',
          1: '未领取奖励',
          2: '已完成',
          '00': '已完成'
        },
        r = [
          '',
          '当日',
          '当周',
          '当月'
        ],
        s = [
          '去做任务',
          '继续完成',
          '领取奖励',
          '已完成',
          '一键开通'
        ],
        t = [
          'do-mission',
          'doing-mission',
          'get-prize',
          'has-complete',
          'do-mission'
        ];
        - 1 === h ? l = 0 === i ? 4 : 0 : 0 === h ? (l = 1, d > 0 && (m = '00', k += '<span class="info-desc">已完成<i>' + f + '</i></span>'))  : 1 === h ? l = 2 : 2 === h && (l = 3),
        p = s[l],
        o = t[l],
        0 != g && 2 === h && (p = r[g] + p);
        var u = [
          '一次性任务',
          '日任务',
          '周任务',
          '月任务',
          '新任务',
          '火热任务'
        ];
        if (0 !== a.frequencyType) {
          var g = a.frequencyType;
          j += '<label>' + u[g] + '</label>'
        }
        if (a.promotionTag) {
          var v = a.promotionTag;
          1 === v && (j += '<label class="newMission">' + u[4] + '</label>'),
          2 === v && (j += '<label class="newMission">' + u[5] + '</label>')
        }
        if (a.rewardInfo) {
          var w = [
            '',
            qyy.imgHost + 'images/md/gold.png',
            qyy.imgHost + 'images/md/bean.png',
            '',
            qyy.imgHost + 'images/md/coupon.png'
          ],
          x = b.parseJSON(a.rewardInfo);
          '' != x.describeOne && (q += '<img src="' + w[x.rewardTypeOne] + '" alt=""><span>' + x.describeOne + '</span>'),
          '' != x.describeTwo && (q += '<img src="' + w[x.rewardTypeTwo] + '" alt=""><span>' + x.describeTwo + '</span>')
        }
        c = '<div class="row member-mission-all" data-areaShow="' + a.areaShow + '" data-qyy-frequencyType="' + a.frequencyType + '" data-qyy-scheduleShowValue="' + a.scheduleShowValue + '" data-qyy-statusText="' + n[m] + '" data-qyy-awardName="' + a.awardName + '" data-qyy-title="' + a.name + '" data-qyy-desc="' + a.detail + '" data-qyy-status="' + h + '" data-qyy-scheduleTargetValue="' + d + '"><div class="img-wrap"><img src="" class="icon test-lazyload" data-qyy-original=' + a.icon + ' alt=""></div><div class="info"><div class="info-wrap"><p class="title">' + a.name + '</p><p class="desc">' + q + '</p><p class="label">' + j + '</p></div><div class="info-btn-wrap"><span class="info-btn ' + o + '" ' + e.getPageClick(e.qingfrom, a) + ' data-qyy-missionId="' + a.missionId + '">' + p + '</span>' + k + '</div></div></div>'
      }
      return c
    },
    getMemberMissionGroup: function (a) {
      var b = '<div class="row member-empty"><img src="' + qyy.imgHost + 'images/blank.png" alt=""><p>暂无可做任务,明天再来看看吧~</p></div>',
      c = '' === a ? a + b : a;
      return c
    },
    getMemberbalanceElement: function (a) {
      var b = '';
      1 === a.equestionMark && (b = '<img class="count-icon" src="' + qyy.imgHost + 'images/icon_information.png" alt="" data-qyy-desc="' + a.equestionMessage + '">');
      var c = '<div class="item" ' + e.getPageClick(e.qingfrom, a) + '><img src="' + a.eproductImgA + '" class="icon" alt=""><span class="title" style="color:' + a.etitle1Color + '">' + a.etitle1 + '</span><span class="num" id="qyy-member-product-item-' + a.elementType + '"> </span>' + b + '</div>';
      return c
    },
    getMemberbalanceGroup: function (a, b) {
      var c = '<div class="row row-' + b.groupType + ' member-product ' + e.getGroupBottom(b.bottomMargin) + '">' + a + '</div>';
      return c
    },
    getWeixinElement: function (a) {
      var b = '',
      c = '';
      1 === a.equestionMark && (b = '<img class="count-icon" src="' + qyy.imgHost + 'images/icon_information.png" alt="" data-qyy-desc="' + a.equestionMessage + '">', c = 'pl30');
      var d = '';
      switch (a.elementType) {
        case 9:
          d = '<p class="count ' + c + '" data-qyy-title="钱包余额">钱包余额(元)' + b + '</p><p class="count-num" id="qyy-count-num" ' + e.getPageClick(e.qingfrom, a) + '></p>';
          break;
        case 10:
          d = '<div class="other"><div class="xiaobai"><p class="title ' + c + '" data-qyy-title="小白信用">小白信用' + b + '</p><p class="title-num" id="qyy-weixin-value" ' + e.getPageClick(e.qingfrom, a) + '></p></div>';
          break;
        case 11:
          d = '<div class="bankcard"><p class="title ' + c + '" data-qyy-title="京东支付银行卡">京东支付银行卡' + b + '</p><p class="title-num" id="qyy-weixin-bankcard" ' + e.getPageClick(e.qingfrom, a) + '></p></div>';
          break;
        case 13:
          d = '<div class="top-banner" ' + e.getPageClick(e.qingfrom, a) + '>' + a.etitle9 + '<img src="' + qyy.imgHost + 'images/backup.png"></div>';
          break;
        case 14:
          d = '<div class="xjk" ' + e.getPageClick(e.qingfrom, a) + '>' + a.etitle9 + '</div>';
          break;
        case 15:
          d = '<div class="bankcard"><p class="title ' + c + '" data-qyy-title="金币">金币' + b + '</p><p class="title-num" id="qyy-weixin-gold" ' + e.getPageClick(e.qingfrom, a) + '></p></div>'
      }
      return d
    },
    getWeixinGroup: function (a, b) {
      var c = '<div class="row weixin ' + e.getGroupBottom(b.bottomMargin) + '">' + a + '</div>';
      return c
    },
    callback: function () {
    },
    getFixedTopBannerElement1: function (a) {
      if (qyy.hasFixedTop = !0, 16 === a.elementType) var b = '<div class="header" ' + e.getPageClick(e.qingfrom, a) + '><img class="icon" src="' + qyy.imgHost + 'images/zuoce.png" alt=""><img class="user-img" src="' + qyy.imgHost + 'images/default_header.png" id="qyy-jr-header-user" alt=""></div>';
      if (17 === a.elementType) {
        var c = '';
        a.etitle1 && (c = '<div class="download" style="color:' + a.etitle1Color + ';background:' + a.ebackgroundColor + '" ' + e.getPageClick(e.qingfrom, a) + '>' + a.etitle1 + '</div>');
        var b = '<img class="jr-logo" src="' + qyy.imgHost + 'images/jr-logo.png" alt="">' + c
      }
      return b
    },
    getFixedTopBannerGroup1: function (a, b) {
      var c = '<div class="row jr-header ' + e.getGroupBottom(b.bottomMargin) + '">' + a + '</div>';
      return c
    },
    getFixedTopBannerElement2: function (a) {
      qyy.hasFixedTop = !0;
      var b = '<div class="item" ' + e.getPageClick(e.qingfrom, a) + '><img src="' + e.defaultImg + '" class="user-img test-lazyload" data-qyy-original="' + a.eproductImgA + '" alt=""><span style="color:' + a.etitle1Color + '">' + a.etitle1 + '</span></div>';
      return b
    },
    getFixedTopBannerGroup2: function (a) {
      var b = '<div class="add-top" id="qyy-add-top"><div class="add-top-wrap"><span>' + qyy.headerTitle + '</span><img class="add-top-left" id="qyy-add-top-left" src="' + qyy.imgHost + 'images/go_pre.png" alt=""><img class="add-top-right" id="qyy-add-top-right" src="' + qyy.imgHost + 'images/more.png" alt=""><div class="personal-list" id="qyy-personal-list">' + a + '</div></div></div>';
      return b
    },
    getFixedTopMenuElement: function (a) {
      var b = '<div class="item" ' + e.getPageClick(e.qingfrom, a) + '><img src="' + e.defaultImg + '" class="user-img test-lazyload" data-qyy-original="' + a.eproductImgA + '" alt=""><span style="color:' + a.etitle1Color + '">' + a.etitle1 + '</span></div>';
      return b
    },
    getFixedTopMenuGroup: function (a) {
      var b = '<div class="personal-list" id="qyy-personal-list">' + a + '</div>';
      return b
    },
    getFixedTopBottomElement1: function (a) {
      var c = a.eredId,
      d = a.eid,
      f = '';
      0 != parseInt(c) && b.tools.getCookie('qyy' + c) != c && (f = '<span class="red-point"></span>'),
      qyy.hasFixedBottom = !0;
      var g = '<div class="item" data-qyy-eredId="' + c + '" data-qyy-eid="' + d + '" ' + e.getPageClick(e.qingfrom, a) + '><img src="' + a.eproductImgA + '" class="user-img" alt=""><p class="blue" style="color:' + a.etitle1Color + '">' + a.etitle1 + '</p>' + f + '</div>';
      return g
    },
    getFixedTopBottomGroup1: function (a) {
      var b = '<div class="add-bottom" id="qyy-add-bottom">' + a + '</div>';
      return b
    },
    getButtonElement1: function (a) {
      var b = '<div class="open-xbxy-btn1" ' + e.getPageClick(e.qingfrom, a) + '><div class="btn1" style="color:' + a.etitle1Color + ';background:' + a.ebackgroundColor + '">' + a.etitle1 + '</div></div>';
      return b
    },
    getButtonGroup1: function (a, b) {
      var c = '<div class="row buttons ' + e.getGroupBottom(b.bottomMargin) + '">' + a + '</div>';
      return c
    },
    getSingleTextElement: function (a) {
      var b = 'center';
      '' != a.extData && (b = a.extData);
      var c = '<p style="color:' + a.etitle1Color + ';background:' + a.ebackgroundColor + ';text-align:' + b + '" ' + e.getPageClick(e.qingfrom, a) + '>' + a.etitle1 + '</p>';
      return c
    },
    getSingleTextGroup: function (a, b) {
      var c = '<div class="row copyright ' + e.getGroupBottom(b.bottomMargin) + '">' + a + '</div>';
      return c
    },
    getHeightElement: function (a) {
      var b = a.spaceHeight + 'px',
      c = '<p style="height:' + b + ';background:' + a.spaceColor + '" ' + e.getPageClick(e.qingfrom, a) + '></p>';
      return c
    },
    getHeightGroup: function (a, b) {
      var c = '<div class="row ' + e.getGroupBottom(b.bottomMargin) + '">' + a + '</div>';
      return c
    },
    getUserAssetsElement: function (a) {
      var b = '',
      c = a.elementType,
      d = '<img class="arrow" src="' + qyy.imgHost + 'images/icon_arrow1.png" alt="">';
      if (0 === a.ejumpType && (d = ''), 32 === c) {
        var f = '获取中',
        g = '获取中';
        a.etitle1 && (f = a.etitle1),
        a.etitle2 && (g = a.etitle2),
        '' != d && (d = '<img class="more" src="' + qyy.imgHost + 'images/icon_arrow1.png" alt="">'),
        b = '<section class="total" ' + e.getPageClick(e.qingfrom, a) + '><p class="title">总资产(元)</p><p class="count" id="qyy-personal-assets-total">' + f + '</p><p class="profit">今日收益<span id="qyy-personal-assets-profit">' + g + '</span></p>' + d + '</section>'
      } else if (37 === c) {
        var h = '获取中',
        i = '获取中';
        a.etitle1 && (h = a.etitle1),
        a.etitle2 && (i = a.etitle2),
        '' != d && (d = '<img class="more" src="' + qyy.imgHost + 'images/icon_arrow1.png" alt="">'),
        b = '<section class="total" ' + e.getPageClick(e.qingfrom, a) + '><p class="title">白条可用额度(元)</p><p class="count" style="color:' + a.etitle1Color + '" id="qyy-personal-assets-baitiao">' + h + '</p><p class="baitiao-profit" id="qyy-personal-assets-baitiao-pay" style="color:' + a.etitle2Color + '">' + i + '</p>' + d + '</section>'
      } else if (33 === c) {
        var j = '获取中';
        a.etitle1 && (j = a.etitle1),
        b = '<div class="item" ' + e.getPageClick(e.qingfrom, a) + '><p class="name">活期定期</p><p class="num" style="color:' + a.etitle1Color + '"><span id="qyy-personal-assets-hqdq">' + j + '</span></p>' + d + '</div>'
      } else if (34 === c) {
        var k = '获取中';
        a.etitle1 && (k = a.etitle1),
        b = '<div class="item" ' + e.getPageClick(e.qingfrom, a) + '><p class="name">基金</p><p class="num" style="color:' + a.etitle1Color + '"><span id="qyy-personal-assets-fund" >' + k + '</span></p>' + d + '</div>'
      } else if (36 === c) b = '<div class="item" ' + e.getPageClick(e.qingfrom, a) + '><p class="name">小白理财</p><p class="num" style="color:' + a.etitle1Color + '">' + a.etitle1 + '</p>' + d + '</div>';
       else if (35 === c) {
        var l = '获取中';
        a.etitle1 && (l = a.etitle1),
        b = '<div class="item" ' + e.getPageClick(e.qingfrom, a) + '><p class="name">京东小金库</p><p class="num" style="color:' + a.etitle1Color + '"><span id="qyy-personal-assets-xjk">' + l + '</span></p>' + d + '</div>'
      } else if (38 === c) {
        var m = '获取中';
        a.etitle1 && (m = a.etitle1),
        b = '<div class="item" ' + e.getPageClick(e.qingfrom, a) + '><p class="name">小白信用</p><p class="num"><span id="qyy-personal-assets-xbxy">' + m + '</span></p>' + d + '</div>'
      } else if (39 === c) {
        var n = '获取中';
        a.etitle1 && (n = a.etitle1),
        b = '<div class="item" ' + e.getPageClick(e.qingfrom, a) + '><p class="name">金条(可借额度)</p><p class="num"><span id="qyy-personal-assets-jintiao">' + n + '</span></p>' + d + '</div>'
      } else if (40 === c) {
        var o = '安全退出';
        a.etitle1 && (o = a.etitle1),
        b = '<section data-qyy-exitUrl="' + a.ejumpUrl + '" class="row exit-login" id="qyy-logout" style="color:' + a.etitle1Color + '" ' + e.getPageClick(e.qingfrom, a) + '>' + o + '</section>'
      } else 31 === c && (b = '<section class="personal-assets-user" ' + e.getPageClick(e.qingfrom, a) + '><img class="header" id="qyy-personal-assets-user-img" src="' + qyy.links.defaultHeaderImg + '" alt=""><div class="info"><div class="name" id="qyy-personal-assets-user-name"></div><span class="user-pin" id="qyy-personal-assets-user-pin"></span></div><div class="right"><span style="color:' + a.etitle1Color + '">' + a.etitle1 + '</span>' + d + '</div></section>');
      return b
    },
    getUserAssetsGroup: function (a, b) {
      var c = '<div class="row personal-assets ' + e.getGroupBottom(b.bottomMargin) + '">' + a + '</div>';
      return c
    },
    getJDappBalanceElement: function (a) {
      var b = a.elementType,
      c = a.equestionMark,
      d = a.equestionMessage,
      f = a.eproductImgA,
      g = '',
      h = '',
      i = '';
      return 1 === c && (i = '<p class="desc">' + d + '</p>'),
      9 === b ? h = '<div class="item" id="qyy-account-balance-item-wallet"><p class="title">钱包余额(元)</p><div class="count-wrap"><span class="count" id="qyy-wallet-balance-count" ' + e.getPageClick(e.qingfrom, a) + '>获取中</span>' + g + '</div>' + i + '</div>' : 44 === b ? h = '<div class="item" id="qyy-account-balance-item-account"><p class="title">账户余额(元)</p><div class="count-wrap"><span class="count" id="qyy-account-balance-count" ' + e.getPageClick(e.qingfrom, a) + '>获取中</span>' + g + '</div>' + i + '</div>' : 45 === b ? h = '' != f ? '<img class="account-balance-btn" id="qyy-wallet-balance-btn" src="' + f + '" alt="" ' + e.getPageClick(e.qingfrom, a) + '>' : '' : 46 === b ? h = '' != f ? '<img class="account-balance-btn" id="qyy-account-balance-btn" src="' + f + '" alt="" ' + e.getPageClick(e.qingfrom, a) + '>' : '' : void 0
    },
    getJDappBalanceGroup: function (a, b) {
      var c = '<div class="row account-balance ' + e.getGroupBottom(b.bottomMargin) + '">' + a + '</div>';
      return c
    },
    getDoubleBannerElement: function (a) {
      var b = '<div class="item"><div class="img-wrap"><img src="" class="test-lazyload" data-qyy-original="' + a.eproductImgA + '" alt="" ' + e.getPageClick(e.qingfrom, a) + '></div></div>';
      return b
    },
    getDoubleBannerGroup: function (a, b) {
      var c = '<div class="row row-' + b.groupType + ' double-banner ' + e.getGroupBottom(b.bottomMargin) + '">' + a + '</div>';
      return c
    },
    getLicaiProductElement: function (a) {
      var b = a.etitle1,
      c = 'item';
      d.hasChinese(b) && (c = 'item chinese');
      var f = '<div class="' + c + '" ' + e.getPageClick(e.qingfrom, a) + ' style="background:' + a.ebackgroundColor + '"><div class="left"><span class="title" style="color:' + a.etitle1Color + '">' + a.etitle1 + '</span><span class="desc" style="color:' + a.etitle2Color + '">' + a.etitle2 + '</span></div><div class="right"><span class="title" style="color:' + a.etitle3Color + '">' + a.etitle3 + '</span><span class="desc" style="color:' + a.etitle4Color + '">' + a.etitle4 + '</span></div></div>';
      return f
    },
    getLicaiProductGroup: function (a, b) {
      var c = '<div class="row row-' + b.groupType + ' licai-product ' + e.getGroupBottom(b.bottomMargin) + '">' + a + '</div>';
      return c
    },
    getLicaiSkuElement: function (a) {
      var b = '<div class="item" ' + e.getPageClick(e.qingfrom, a) + ' style="background:' + a.ebackgroundColor + '"><p class="title"><span style="color:' + a.etitle1Color + '">' + a.etitle1 + '</span><label style="color:' + a.etagColor + '">' + a.etag + '</label></p><p class="value" style="color:' + a.etitle2Color + '">' + a.etitle2 + '</p><p class="desc" style="color:' + a.etitle3Color + '">' + a.etitle3 + '</p></div>';
      return b
    },
    getLicaiSkuGroup: function (a, b) {
      var c = '<div class="row row-' + b.groupType + ' licai-sku ' + e.getGroupBottom(b.bottomMargin) + '">' + a + '</div>';
      return c
    },
    getCountDownElement: function (a) {
      var b = '00',
      c = '<div class="text" data-qyy-countDown-endTime="' + a.surplusMs + '" ' + e.getPageClick(e.qingfrom, a) + ' style="background:' + a.ebackgroundColor + '"><i style="color:' + a.etitle1Color + '">' + a.etitle1 + '</i><div><span>' + b + '</span><strong>:</strong><span>' + b + '</span><strong>:</strong><span>' + b + '</span></div></div>';
      return c
    },
    getCountDownGroup: function (a, b) {
      var c = '<div class="row row-' + b.groupType + ' countdown ' + e.getGroupBottom(b.bottomMargin) + '">' + a + '</div>';
      return c
    },
    getAutoPlayNoticeElement: function (a) {
      var b = '',
      c = '';
      0 == a.ejumpType ? b = 'hide' : c = 'pr2';
      var d = '<li class="' + c + '" style="color:' + a.etitle2Color + ';background:' + a.ebackgroundColor + '" ' + e.getPageClick(e.qingfrom, a) + '><span style="color:' + a.etitle1Color + '">' + a.etitle1 + '</span>' + a.etitle2 + '<img class="' + b + '" src="' + qyy.imgHost + 'images/icon_arrow_gray.png"></li>';
      return d
    },
    getAutoPlayNoticeGroup: function (a, b) {
      var c = '<div class="row row-' + b.groupType + ' auto-notice ' + e.getGroupBottom(b.bottomMargin) + '" id="qyy-auto-notice-' + b.id + '"><div class="auto-notice-wrap" id="qyy-auto-notice-wrap-' + b.id + '"><ul>' + a + '</ul></div></div>';
      return c
    },
    getBigBannerElement: function (a) {
      var b = '<img src="' + a.eproductImgA + '" alt="" ' + e.getPageClick(e.qingfrom, a) + '><span id="qyy-big-banner-close"><img src="' + qyy.imgHost + 'images/back.png"></span>';
      return b
    },
    getBigBannerGroup: function (a, b) {
      var c = '<div class="row big-banner" data-qyy-cookieId="' + b.id + '" id="qyy-big-banner">' + a + '</div>';
      return c
    },
    getFixedBottomBtnElement: function (a) {
      var b = '<div class="item" ' + e.getPageClick(e.qingfrom, a) + '><img alt="" src="' + a.eproductImgA + '">' + a.etitle1 + '</div>';
      return b
    },
    getFixedBottomBtnGroup: function (a, b) {
      var c = '<div class="row row-' + b.groupType + ' member-mission-bottom">' + a + '</div>';
      return c
    },
    getFixedTopElement: function (a) {
      qyy.hasFixedTop = !0;
      var b = '<img class="top-img" src="' + a.eproductImgA + '" alt="" ' + e.getPageClick(e.qingfrom, a) + '><img class="back-icon" data-qyy-eid="' + a.eid + '" id="qyy-fixed-top-com" src="' + qyy.imgHost + 'images/fixed_back.png" alt="">';
      return b
    },
    getFixedTopGroup: function (a, b) {
      var c = '<div class="row row-' + b.groupType + '">' + a + '</div>';
      return c
    },
    getFixedBottomElement: function (a) {
      var b = '<img class="bottom-img" src="' + a.eproductImgA + '" alt="" ' + e.getPageClick(e.qingfrom, a) + '><img class="back-icon" data-qyy-eid="' + a.eid + '" id="qyy-fixed-bottom-com" src="' + qyy.imgHost + 'images/fixed_back.png" alt="">';
      return b
    },
    getFixedBottomGroup: function (a, b) {
      var c = '<div class="row row-' + b.groupType + '">' + a + '</div>';
      return c
    },
    getJdSkuElement: function (a) {
      var b = '',
      c = '';
      '' != a.etag && (c = '<label style="color:' + a.etagColor + '">' + a.etag + '</label>'),
      b = 0 === a.mallSkuPriceShow ? '<span class="count">' + a.totalJdPrice + '</span>' : '<span class="count">' + a.instalmentsJdPrice + '</span><span class="desc">起x' + a.mallSkuPriceShow + '期</span>';
      var d = '<div class="item" ' + e.getPageClick(e.qingfrom, a) + '><div class="bg">' + c + '<div class="img-wrap"><img src="" class="test-lazyload" data-qyy-original="' + a.eproductImgA + '"></div><p class="title" style="color:' + a.etitle1Color + '">' + a.etitle1 + '</p><p class="price"><span class="type">￥</span>' + b + '</p></div></div>';
      return 0 === a.totalJdPrice && (d = ''),
      d
    },
    getJdSkuGroup: function (a) {
      var b = '<div class="row jd-sku">' + a + '</div>';
      return b
    },
    getZcSkuElement: function (a) {
      var b = a.zcSkuScheduleShow,
      c = a.projectStatusName,
      d = a.projectStatus,
      f = a.redoundMinAmount,
      g = '',
      h = '',
      i = '',
      j = '',
      k = '';
      if ('' != a.etag && (k = '<label style="color:' + a.etagColor + '">' + a.etag + '</label>'), a.redoundMinAmount || (f = '暂无价格', g = 'hide'), 1 === b) {
        var l = 'status-btn';
        6 === d ? (j = a.progress >= 100 ? '100%' : a.progress + '%', h = '<div class="progress-wrap"><div class="progress"><div class="progress-inner" style="width:' + j + '"></div></div><div class="num">' + a.progressShow + '</div></div>')  : (l = 'status-btn gray', h = '<div class="' + l + '">' + c + '</div>')
      } else i = 'mb32';
      var m = '<div class="item" ' + e.getPageClick(e.qingfrom, a) + '><div class="bg">' + k + '<div class="img-wrap"><img src="" class="test-lazyload" data-qyy-original="' + a.eproductImgA + '"></div><p class="title" style="color:' + a.etitle1Color + '">' + a.etitle1 + '</p><p class="price ' + i + '"><span class="type ' + g + '">￥</span><span class="count">' + f + '</span><span class="desc ' + g + '">起</span></p>' + h + '</div></div>';
      return m
    },
    getZcSkuGroup: function (a) {
      var b = '<div class="row zc-sku">' + a + '</div>';
      return b
    },
    getZcTabSkuElement: function (a) {
      var b = a.zcSkuScheduleShow,
      c = a.projectStatusName,
      d = a.projectStatus,
      f = a.redoundMinAmount,
      g = '',
      h = '',
      i = '',
      j = '',
      k = '';
      if ('' != a.etag && (k = '<label style="color:' + a.etagColor + '">' + a.etag + '</label>'), a.redoundMinAmount || (f = '暂无价格', g = 'hide'), 1 === b) {
        var l = 'status-btn';
        6 === d ? (j = a.progress >= 100 ? '100%' : a.progress + '%', i = '<div class="progress-wrap"><div class="progress"><div class="progress-inner" style="width:' + j + '"></div></div><div class="num">' + a.progressShow + '</div></div>')  : (l = 'status-btn gray', i = '<div class="' + l + '">' + c + '</div>')
      } else h = 'mb32';
      var m = '<div class="item" ' + e.getPageClick(e.qingfrom, a) + '><div class="bg">' + k + '<div class="img-wrap"><img src="" class="test-lazyload" data-qyy-original="' + a.eproductImgA + '"></div><p class="title" style="color:' + a.etitle1Color + '">' + a.etitle1 + '</p><p class="price ' + h + '"><span class="type ' + g + '">￥</span><span class="count">' + f + '</span><span class="desc ' + g + '">起</span></p>' + i + '</div></div>';
      return m
    },
    getZcTabSkuGroup: function (a, b) {
      var c = '<div class="swiper-slide">' + a + '</div>';
      return qyy.tabProducts.skuMenuItemMap.push(b.tagName),
      c
    },
    getJdTabSkuElement: function (a) {
      var b = '',
      c = '';
      '' != a.etag && (c = '<label style="color:' + a.etagColor + '">' + a.etag + '</label>'),
      b = 0 === a.mallSkuPriceShow ? '<span class="count">' + a.totalJdPrice + '</span>' : '<span class="count">' + a.instalmentsJdPrice + '</span><span class="desc">起x' + a.mallSkuPriceShow + '期</span>';
      var d = '<div class="item" ' + e.getPageClick(e.qingfrom, a) + '><div class="bg">' + c + '<div class="img-wrap"><img src="" class="test-lazyload" data-qyy-original="' + a.eproductImgA + '"></div><p class="title" style="color:' + a.etitle1Color + '">' + a.etitle1 + '</p><p class="price"><span class="type">￥</span>' + b + '</p></div></div>';
      return 0 === a.totalJdPrice && (d = ''),
      d
    },
    getJdTabSkuGroup: function (a, b) {
      var c = '<div class="swiper-slide">' + a + '</div>';
      return qyy.tabProducts.skuMenuItemMap.push(b.tagName),
      c
    },
    getBanner1to2Element: function (a) {
      var b = {
        getComStr: function (a) {
          var b = '<div class="banner"><p class="title"><span class="title-1">' + a.etitle1 + '</span><span class="title-2" style="color:' + a.etitle2Color + '">' + a.etitle2 + '</span></p><p class="desc">' + a.etitle3 + '</p><img src="" class="test-lazyload" data-qyy-original="' + a.eproductImgA + '" alt=""></div></div>';
          return b
        },
        getLeftStr: function (a) {
          var b = '<div class="com left big" ' + e.getPageClick(e.qingfrom, a) + ' style="background:' + a.ebackgroundColor + '">',
          c = this.getComStr(a);
          return b + c
        },
        getRightTopStr: function (a) {
          var b = '<div class="com right top" ' + e.getPageClick(e.qingfrom, a) + ' style="background:' + a.ebackgroundColor + '">',
          c = this.getComStr(a);
          return b + c
        },
        getRightBottomStr: function (a) {
          var b = '<div class="com right bottom" ' + e.getPageClick(e.qingfrom, a) + ' style="background:' + a.ebackgroundColor + '">',
          c = this.getComStr(a);
          return b + c
        },
        init: function (a) {
          var c = {
            50: 'getLeftStr',
            51: 'getRightTopStr',
            52: 'getRightBottomStr'
          };
          return b[c[a.elementType]](a)
        }
      };
      return b.init(a)
    },
    getBanner1to2Group: function (a, b) {
      var c = '<div class="row row-' + b.groupType + ' banner-1-2 ' + e.getGroupBottom(b.bottomMargin) + '">' + a + '</div>';
      return c
    },
    getSignElement: function (a) {
      var b = '',
      c = a.elementType,
      d = '获取中...',
      f = '...',
      g = a.etitle1 ? a.etitle1 : d;
      return 53 === c && (b = '<div class="result" id="appSign-result"><div class="draw-result"><div class="day getIn" id="appSign-day">' + f + '</div><div class="other"><p class="yearAndMonth" id="appSign-yearAndMonth">' + d + '</p><p class="draw-text" id="appSign-draw-text">' + d + '</p></div></div><div class="btn" id="appSign-btn" ' + e.getPageClick(e.qingfrom, a) + '>' + g + '</div></div><div class="gb-wrap appSign-switch hide" id="appSign-gb-wrap"></div>'),
      54 === c && (b = '<div class="sign-banner hide appSign-switch" ' + e.getPageClick(e.qingfrom, a) + ' id="appSign-sign-banner"><img src="" class="test-lazyload" data-qyy-original="' + a.eproductImgA + '" alt=""></div>'),
      b
    },
    getSignGroup: function (a, b) {
      var c = '<div class="row row-' + b.groupType + ' appSign" id="qyy-appSign" ' + e.getGroupBottom(b.bottomMargin) + '">' + a + '<div class="switch appSign-switch hide" id="appSign-display-switch"><img src="images/switch.png" alt=""></div></div>';
      return c
    }
  };
  a.tempMap = e
}(window, Zepto),
function (a, b) {
  var c = b.tools,
  d = {
    actionErrCount: 0,
    systemPop: function (a) {
      if (1 === this.actionErrCount) {
        qyy.isActionErr = !0,
        b('.detail-cover').remove();
        var c = '<div class="detail-cover"><div id="qyy-cover-info">' + a + '</div></div>';
        b('#qyy-body-wrap').append(c),
        b('.detail-cover').removeClass('hide').addClass('animated fadeIn'),
        setTimeout(function () {
          b('.detail-cover').removeClass('animated fadeIn').addClass('animated fadeOut'),
          setTimeout(function () {
            b('.detail-cover').removeClass('animated fadeOut').addClass('hide')
          }, 1000)
        }, 2000)
      }
    },
    simplePop: function (a) {
      var b = '<div class="pop_com_show">';
      if (a.img && (b += '<img class="pop_com_img width90" src="' + a.img + '" alt="">'), a.img90 && (b += '<img class="pop_com_img width90" src="' + a.img90 + '" alt="">'), a.img100 && (b += '<img class="pop_com_img width100" src="' + a.img100 + '" alt="">'), a.title && (b += '<div class="pop_com_title">' + a.title + '</div>'), a.title1 && (b += '<div class="pop_com_title style1">' + a.title1 + '</div>'), a.desc && (b += '<div class="pop_com_desc">' + a.desc + '</div>'), a.desc1 && (b += '<div class="pop_com_desc style1">' + a.desc1 + '</div>'), a.subtitle && (b += '<div class="pop_com_subtitle">' + a.subtitle + '</div>'), a.label && (b += '<div class="pop_com_label">' + a.label + '</div>'), a.label_desc && (b += '<div class="pop_com_label_desc">' + a.label_desc + '</div>'), a.label1 && (b += '<div class="pop_com_label">' + a.label1 + '</div>'), a.label_desc1) {
        var d = '';
        '' != a.scheduleShowValue && (d = '<i>' + a.scheduleShowValue + '</i>'),
        b += '<div class="pop_com_label_desc style1">' + a.label_desc1 + d + '</div>'
      }
      if (a.label_desc2 && (b += '<div class="pop_com_label_desc style1">' + a.label_desc2 + '</div>'), a.progress === !0) {
        var e = c.getFractionToDecimal(a.scheduleShowValue);
        b += '<div class="progress-wrap"><div class="progress progressIn" style="width:' + (100 * e).toFixed(2) + '%"></div></div>'
      }
      b += '</div>',
      a.btn && (b += '<div class="pop_com_btn"><div class="btn" id="qyy-pop_com_button">' + a.btn + '</div>'),
      a.btn1 && (b += '<div id="qyy-button_jump" class="btn blue">' + a.btn1 + '</div>'),
      a.btn2 && (b += '<div id="qyy-button_check_name" class="btn blue">' + a.btn2 + '</div>'),
      a.btn3 && (b += '<div class="pop_com_btn show"><div id="qyy-button_jump_balance" class="btn blue w100p">' + a.btn3 + '</div>'),
      a.btn4 && (b += '<div class="btn w100p topLine" id="qyy-pop_com_button">' + a.btn4 + '</div>'),
      b += '</div>';
      var f = '';
      a.topLabel && (f = '<span class="pop_top_label">' + a.topLabel + '</span>');
      var g = '';
      a.topImg && (g = '<span class="pop_top_complete"><img src="' + a.topImg + '"></span>');
      var b = '<div class="pop_com_wrap" id="qyy-pop_com_wrap"><div class="pop_com_style2">' + g + f + b + '</div></div>';
      return b
    },
    showSimplePop: function (a, c) {
      b('#qyy-pop_com_wrap').remove(),
      b('.wrap').append(a);
      var d = b('#qyy-pop_com_wrap');
      'wx' == c && d.addClass('weixin'),
      d.removeClass('hide').addClass('bounceIn'),
      setTimeout(function () {
        d.removeClass('bounceIn')
      }, 150)
    },
    hideSimplePop: function () {
      var a = b('#qyy-pop_com_wrap');
      a.addClass('bounceOut'),
      setTimeout(function () {
        a.removeClass('bounceOut').addClass('hide').remove()
      }, 150)
    },
    showLoading: function () {
      b('#qyy-page-loading').removeClass('hide')
    },
    hideLoading: function () {
      setTimeout(function () {
        b('#qyy-page-loading').addClass('hide')
      }, 450)
    },
    enterInAnimation: function () {
      var a = {
        $body: b('#body'),
        $wrap: b('.wrap-container'),
        enterWidthCss: function () {
          this.$wrap.removeClass('hide'),
          this.$body.removeClass('hide').addClass('bounceIn'),
          setTimeout(function () {
            d.hideLoading(),
            a.$body.removeClass('bounceIn')
          }, 410)
        },
        enterWidthoutCss: function () {
          setTimeout(function () {
            d.hideLoading()
          }, 410),
          this.$wrap.removeClass('hide'),
          this.$body.removeClass('hide')
        },
        enterRule: function () {
          qyy.isInJdApp ? this.enterWidthoutCss()  : b.tools.checkIos10_2_1() ? this.enterWidthoutCss()  : this.enterWidthCss()
        },
        init: function () {
          this.enterRule()
        }
      };
      a.init()
    }
  };
  a.popUi = d
}(window, Zepto),
function (a, b) {
  var c = a.tempMap,
  d = a.popUi,
  e = a.communication,
  f = (a.links, a.addition, a.checkAjax),
  g = b.tools,
  h = {
    init: function (a, c, e, g, h, i, j, k) {
      var l = k ? 8000 : 0;
      qyy.isEnterInLoaing || d.showLoading(),
      b.ajax({
        url: a,
        type: c,
        timeout: l,
        dataType: e,
        data: g,
        async: h,
        json: 'callback',
        success: function (a) {
          0 === a.resultCode ? qyy.isEnterInLoaing || d.hideLoading()  : 3 === a.resultCode || (qyy.isActionErr = !0, d.actionErrCount++, d.systemPop('系统开小差了')),
          i(a, j),
          1 === k && qyy.isQyyOut && f.init(f.getSuccessData({
            type: '1'
          }))
        },
        error: function () {
          1 === k && qyy.isQyyOut && f.init(f.getErrorData({
            type: '1'
          })),
          qyy.isActionErr = !0,
          d.actionErrCount++,
          d.systemPop('系统开小差了')
        },
        complete: function (a, c) {
          qyy.isQyyOut && k && 'timeout' == c && b.tools.dealSystemError()
        }
      })
    },
    initPage: function (a) {
      if (!g.isEmptyObject(a.resultData)) {
        var c = a.resultData,
        d = c.title,
        f = c.isShare,
        h = c.shareTitle,
        i = c.shareSubtitle,
        j = qyy.protocol + c.shareImgUrl,
        k = c.shareExplain,
        l = c.sharePosition,
        m = c.shareUrl,
        n = c.levitateButton,
        o = c.levitateButtonImg,
        p = c.levitateButtonJumpType,
        q = c.levitateButtonJumpUrl;
        qyy.headerTitle = d,
        qyy.isLogin = Boolean(c.isLogin),
        '' === j && (j = qyy.statics.jrlogo),
        qyy.isReturnTop = c.isReturnTop;
        var r = [
          51
        ];
        if ( - 1 == b.inArray(qyy.userType, r) && (qyy.isStatic || b('#qyy-web-title').html(d)), 1 === parseInt(n)) {
          var s = '<div class="gost-btn hide" id="qyy-gost-btn" data-qyy-ejumptype="' + p + '" clstag="" data-qyy-jumpt="' + q + '"><img src="' + o + '" alt=""></div>';
          b('.wrap-container').append(s)
        }
        if (1 === f) {
          for (var t = l.split(','), u = 0, v = t.length; v > u; u++) 1 == parseInt(t[u]) ? g.isJDApp() && e.initJdAppShare(h, i, k, m, j)  : 2 == parseInt(t[1]) && g.isApp() && e.initJrAppShare(h, i, k, m, j);
          g.isWeiXin() && e.initWeixinShare(h, i, k, m, j)
        }
      }
    },
    loadAllFloor: function (a) {
      var b = {
        focusCount: 0,
        groupTypeList: [
        ],
        initGroupTypeList: function () {
          this.groupTypeList[0] = [
            0,
            c.getFocusElement,
            c.getFocusGroup
          ],
          this.groupTypeList[1] = [
            1,
            c.getBannerElement,
            c.getBannerGroup
          ],
          this.groupTypeList[3] = [
            3,
            c.getSingleProductElement,
            c.getSingleProductGroup
          ],
          this.groupTypeList[31] = [
            31,
            c.getSingleProductElement,
            c.getSingleProductGroup
          ],
          this.groupTypeList[102] = [
            102,
            c.getImgProductElement,
            c.getImgProductGroup
          ],
          this.groupTypeList[4] = [
            4,
            c.getDoubleAndIconElement,
            c.getDoubleAndIconGroup
          ],
          this.groupTypeList[7] = [
            7,
            c.getSingleIconElement,
            c.getSingleIconGroup
          ],
          this.groupTypeList[10] = [
            10,
            c.getRowBannerElement,
            c.getRowBannerGroup
          ],
          this.groupTypeList[22] = [
            22,
            c.getZcNewsElement,
            c.getZcNewsGroup
          ],
          this.groupTypeList[32] = [
            32,
            c.getMemberInfoElement,
            c.getMemberInfoGroup
          ],
          this.groupTypeList[33] = [
            33,
            c.getMemberbalanceElement,
            c.getMemberbalanceGroup
          ],
          this.groupTypeList[34] = [
            34,
            c.getMemberMissionElement,
            c.getMemberMissionGroup
          ],
          this.groupTypeList[144] = [
            144,
            c.getMemberMissionElement,
            c.getMemberMissionGroup
          ],
          this.groupTypeList[145] = [
            145,
            c.getMemberMissionElement,
            c.getMemberMissionGroup
          ],
          this.groupTypeList[146] = [
            146,
            c.getMemberMissionElement,
            c.getMemberMissionGroup
          ],
          this.groupTypeList[147] = [
            147,
            c.getMemberMissionElement,
            c.getMemberMissionGroup
          ],
          this.groupTypeList[148] = [
            148,
            c.getMemberMissionElement,
            c.getMemberMissionGroup
          ],
          this.groupTypeList[149] = [
            149,
            c.getMemberMissionElement,
            c.getMemberMissionGroup
          ],
          this.groupTypeList[150] = [
            150,
            c.getMemberMissionElement,
            c.getMemberMissionGroup
          ],
          this.groupTypeList[151] = [
            151,
            c.getMemberMissionElement,
            c.getMemberMissionGroup
          ],
          this.groupTypeList[152] = [
            152,
            c.getMemberMissionElement,
            c.getMemberMissionGroup
          ],
          this.groupTypeList[54] = [
            54,
            c.getMemberMissionElement,
            c.getMemberMissionGroup
          ],
          this.groupTypeList[47] = [
            47,
            c.getJDappBalanceElement,
            c.getJDappBalanceGroup
          ],
          this.groupTypeList[35] = [
            35,
            c.getWeixinElement,
            c.getWeixinGroup
          ],
          this.groupTypeList[18] = [
            18,
            c.getObjectElement,
            c.getObjecttGroup
          ],
          this.groupTypeList[36] = [
            36,
            c.getFixedTopBannerElement1,
            c.getFixedTopBannerGroup1
          ],
          this.groupTypeList[37] = [
            37,
            c.getFixedTopBannerElement2,
            c.getFixedTopBannerGroup2
          ],
          this.groupTypeList[38] = [
            38,
            c.getFixedTopBottomElement1,
            c.getFixedTopBottomGroup1
          ],
          this.groupTypeList[55] = [
            55,
            c.getFixedBottomBtnElement,
            c.getFixedBottomBtnGroup
          ],
          this.groupTypeList[41] = [
            41,
            c.getButtonElement1,
            c.getButtonGroup1
          ],
          this.groupTypeList[43] = [
            43,
            c.getSingleTextElement,
            c.getSingleTextGroup
          ],
          this.groupTypeList[42] = [
            42,
            c.getUserAssetsElement,
            c.getUserAssetsGroup
          ],
          this.groupTypeList[44] = [
            44,
            c.getBigBannerElement,
            c.getBigBannerGroup
          ],
          this.groupTypeList[48] = [
            48,
            c.getDoubleBannerElement,
            c.getDoubleBannerGroup
          ],
          this.groupTypeList[49] = [
            49,
            c.getCountDownElement,
            c.getCountDownGroup
          ],
          this.groupTypeList[51] = [
            51,
            c.getLicaiProductElement,
            c.getLicaiProductGroup
          ],
          this.groupTypeList[52] = [
            52,
            c.getAutoPlayNoticeElement,
            c.getAutoPlayNoticeGroup
          ],
          this.groupTypeList[45] = [
            45,
            c.getFixedTopElement,
            c.getFixedTopGroup
          ],
          this.groupTypeList[46] = [
            46,
            c.getFixedBottomElement,
            c.getFixedBottomGroup
          ],
          this.groupTypeList[122] = [
            122,
            c.getJdSkuElement,
            c.getJdSkuGroup
          ],
          this.groupTypeList[123] = [
            123,
            c.getZcSkuElement,
            c.getZcSkuGroup
          ],
          this.groupTypeList[124] = [
            124,
            c.getJdTabSkuElement,
            c.getJdTabSkuGroup
          ],
          this.groupTypeList[125] = [
            125,
            c.getZcTabSkuElement,
            c.getZcTabSkuGroup
          ],
          this.groupTypeList[126] = [
            126,
            c.getLicaiSkuElement,
            c.getLicaiSkuGroup
          ],
          this.groupTypeList[132] = [
            132,
            c.getHeightElement,
            c.getHeightGroup
          ],
          this.groupTypeList[153] = [
            153,
            c.getBanner1to2Element,
            c.getBanner1to2Group
          ],
          this.groupTypeList[154] = [
            154,
            c.getSignElement,
            c.getSignGroup
          ]
        },
        callGroupTypeFunction: function (a, b, c) {
          return a(b, c)
        },
        assembleAndInit: function () {
          var b = '',
          d = a.resultData,
          f = d.pin,
          g = d.resultFloorList;
          qyy.isJrUser = d.isJrUser,
          qyy.isLogin && !qyy.isInApp && 0 != f && qyy.inAppLoginInFlag && e.unifyAppLogin();
          for (var h = 0, i = g.length; i > h; h++) {
            for (var j = '', k = '', l = '', m = '', n = g[h], o = n.display, p = n.groupList, q = n.outH5Point, r = n.fjumpType, s = n.fjumpUrl, t = n.ftitle, u = n.fsubtitle, v = n.ftitleColor, w = n.fTitlePosition, x = n.fsubtitleColor, y = n.fbottomMargin, z = n.fbackgroundColor, A = n.fbackgroundBorder, B = 0, C = p.length; C > B; B++) if (o) {
              var D = '',
              E = p[B],
              F = E,
              G = E.groupType,
              H = E.defaultShowtotal,
              I = '';
              qyy.$obj.dataInput.data(G.toString(), H),
              I = E.elementList ? E.elementList : E.elementIconList,
              '' === k ? k = G : k;
              for (var J = 0, K = I.length; K > J; J++) D += this.callGroupTypeFunction(this.groupTypeList[G][1], I[J], z);
              j += this.callGroupTypeFunction(this.groupTypeList[G][2], D, F)
            }
            if (0 === k && this.focusCount++, '' !== t) {
              var L = {
                ftitle: t,
                ftitleColor: v,
                fsubtitle: u,
                fsubtitleColor: x,
                fjumpType: r,
                fjumpUrl: s,
                floorOutH5Point: q,
                fTitlePosition: w
              };
              l = c.getRowTitile(L)
            } else m = 'hasTopPadding';
            var M = {
              floorTitleStr: l,
              floorStr: j,
              floorType: k,
              fbottomMargin: y,
              fbackgroundBorder: A,
              fbackgroundColor: z,
              hasFloorTitleTopPadding: m
            };
            o && (b += c.getFloor(M))
          }
          qyy.$obj.wrap.append(b)
        },
        init: function () {
          this.initGroupTypeList(),
          this.assembleAndInit()
        }
      };
      b.init()
    },
    getUserGroupData: function (a) {
      if (g.isApp() && setTimeout(function () {
        if (qyy.canChangeAppColor) {
          qyy.canChangeAppColor = !1;
          var a = {
            colorArr: [
              '#39404D',
              '#39404D'
            ]
          };
          e.changeJrAppColor(a)
        }
      }, 50), !a.resultData) return !1;
      var c = a.resultData,
      d = c[1].nickName,
      f = c[1].headSculpturer,
      h = c[3].xbresultCode,
      i = c[3].baiXYValue,
      j = {
        '000000': 0 == i ? '立即开通' : '小白信用' + i,
        '0915': '立即开通',
        '0916': '立即开通',
        '0917': '全新升级',
        '-1': '暂无数据'
      };
      b('.member-user .name').text(d),
      b('.member-user .header').attr('src', f),
      b('#qyy-xbxy-title').text(j[h])
    },
    getTopUserHeaderData: function (a) {
      if (a.resultData) {
        var c = a.resultData,
        d = '';
        c[16] && c[16].headSculpturer && (d = c[16].headSculpturer),
        b('.section-36 .user-img').attr('src', d)
      } else b('.header img').remove(),
      b('.jr-header .header').append('<span class="jr-header-user-login" id="qyy-jr-header-user-login">注册 | 登录<span>'),
      b('.header').removeAttr('data-qyy-click'),
      b('.header').click(function () {
        var a = window.location.href;
        window.location.href = qyy.links.mLogin + encodeURIComponent(a)
      })
    },
    getWeixinBalance: function (a) {
      if (!a.resultData) return !1;
      var c = a.resultData,
      d = c[9].jdQBbalanceStr,
      e = c[10].xbresultCode,
      f = c[10].baiXYValue,
      g = c[11].bankCardCount,
      h = c[15].amount,
      i = c[15].spend,
      j = 'title-num',
      k = '',
      l = {
        '000000': !0,
        '0915': '立即开通',
        '0916': '立即开通',
        '0917': '全新升级',
        '-1': '暂无数据'
      },
      m = l[e];
      m === !0 ? k = f : (k = m, j = 'title-num title-num-none'),
      b('.count-num').text(d),
      b('#qyy-weixin-value').removeClass('title-num').addClass(j).text(k),
      b('#qyy-weixin-bankcard').text(g),
      b('#qyy-weixin-gold').text(h - i),
      '0.00' == d && b('.xjk').addClass('hide')
    },
    getAssetsGroupData: function (a) {
      function c(a) {
        var b = '';
        return 60 >= a ? b = '信用一般' : a > 60 && 70 >= a ? b = '信用中等' : a > 70 && 80 >= a ? b = '信用良好' : a > 80 && 90 >= a ? b = '信用优秀' : a > 90 && 100 >= a && (b = '信用极好'),
        b
      }
      if (!a.resultData) return !1;
      var d = a.resultData,
      e = d[31].nickName,
      f = d[31].userPin,
      g = d[31].headSculpturer,
      h = d[32].totalProertyStr,
      i = d[32].totalProfit,
      j = d[33].otherProperty,
      k = (d[35].isOpenXjk, d[35].xjkPropertyStr),
      l = d[37].isBaiTiaoOpen,
      m = d[37].availableLimitStr,
      n = d[37].outstandingBalanceIn7DaysStr,
      o = d[39].isOpenJT,
      p = d[39].jtProperty,
      q = (d[38].isJrUser, d[38].xbresultCode),
      r = d[38].baiXYValue,
      s = d[34].fundProperty;
      0 > i && b('.personal-assets .profit').addClass('green'),
      i = i > 0 ? '+' + i : i,
      l ? (n = 0 == n ? '近7日无待还' : '近7日待还' + n + '元', b('#qyy-personal-assets-baitiao').text(m))  : (m = '激活送百元大礼包', n = '灵活分期 超低费率', b('#qyy-personal-assets-baitiao').text(m).css('font-size', '1.375rem')),
      0 != s && b('#qyy-personal-assets-fund').text(s + '元'),
      0 != j && b('#qyy-personal-assets-hqdq').text(j + '元'),
      0 != k && b('#qyy-personal-assets-xjk').text(k + '元');
      var t = c(r),
      u = {
        '000000': !0,
        '0915': '立即开通',
        '0916': '立即开通',
        '0917': '全新升级',
        '-1': '暂无数据'
      },
      v = u[q];
      v === !0 ? (b('#qyy-personal-assets-xbxy').text(r).append('<i class="label" id="qyy-personal-assets-xbxy-grade"></i>'), b('#qyy-personal-assets-xbxy-grade').text(t))  : b('#qyy-personal-assets-xbxy').text(v),
      b('#qyy-personal-assets-user-img').attr('src', g),
      b('#qyy-personal-assets-user-name').text(e),
      b('#qyy-personal-assets-user-pin').text(f),
      b('#qyy-personal-assets-total').text(h),
      b('#qyy-personal-assets-profit').text(i + '元'),
      b('#qyy-personal-assets-baitiao-pay').text(n),
      o ? b('#qyy-personal-assets-jintiao').text(p + '元')  : b('#qyy-personal-assets-jintiao').parents('.item').empty().removeAttr('clstag')
    },
    getDataOutData: function () {
    },
    getUserTel: function (a) {
      if (!a.resultData) return !1;
      var c = a.resultData,
      d = !1,
      e = !1,
      f = '';
      c[42] && c[42].isJrUser && (d = !0, f = c[42].maskPhoneNo),
      c[41] && c[41].isJrUser && (e = c[41].isJrUser),
      b('#qyy-classify-user-tel').text(d ? f : '未绑定'),
      b('#qyy-classify-user-check').text(e ? '已实名' : '去认证')
    },
    getMemberProductGroupData: function (a) {
      if (!a.resultData) return !1;
      var c = a.resultData,
      d = c[4].gbbalance,
      e = c[5].amount,
      f = c[5].spend,
      g = c[7].licalCouponsCount,
      h = c[8].jdQBbalance,
      i = c[12].baiXYValue;
      b('#qyy-member-product-item-4').text(d),
      b('#qyy-member-product-item-5').text(e - f),
      b('#qyy-member-product-item-7').text(g),
      b('#qyy-member-product-item-8').text(h.toFixed(2)),
      b('#qyy-member-product-item-12').text(i)
    },
    getJDappBalance: function (a) {
      if (!a.resultData) return !1;
      var c = a.resultData,
      d = c[9].jdQBbalanceStr,
      e = c[44].accountBalanceStr,
      f = b('#qyy-wallet-balance-btn').clone();
      b('#qyy-wallet-balance-btn').remove(),
      b('#qyy-wallet-balance-count').parents('.count-wrap').append(f),
      d > 0 && b('#qyy-wallet-balance-btn').show();
      var g = b('#qyy-account-balance-btn').clone();
      if (b('#qyy-account-balance-btn').remove(), b('#qyy-account-balance-count').parents('.count-wrap').append(g), e > 0 && b('#qyy-account-balance-btn').show(), e > d) {
        var h = b('#qyy-account-balance-item-wallet').clone();
        b('#qyy-account-balance-item-wallet').remove(),
        b('#qyy-account-balance-item-account').after(h)
      }
    },
    getMemberPrize: function (a, c) {
      var e = c,
      f = '',
      g = {
      },
      h = a.resultData,
      i = h.code;
      '0004' == i ? (g = {
        img100: qyy.statics.successIcon,
        title1: '恭喜你获得' + e.parents('.member-mission-all').attr('data-qyy-awardname'),
        label_desc: '温馨提示：奖励已发放到您的账户，请前往“会员中心”查看。',
        btn: '关闭'
      }, 0 != b('.mission-btn').length && (g.title1 = '恭喜你获得' + b('#qyy-header-desc').text()))  : g = '0005' == i || '0006' == i ? {
        img100: qyy.statics.errorIcon,
        title1: '啊哦！奖励领取失败，请稍后重试~',
        btn: '关闭'
      }
       : '0007' == i ? {
        img100: qyy.statics.errorIcon,
        title1: '您已领取过任务奖励，不能重复领取哦~',
        btn: '关闭'
      }
       : {
        img100: qyy.statics.errorIcon,
        title1: '系统开小差了，请稍后再试~',
        btn: '关闭'
      },
      b('.pop_com_wrap').remove(),
      f = d.simplePop(g),
      d.showSimplePop(f),
      b('#qyy-pop_com_button').click(function () {
        window.location.reload()
      })
    },
    getMemberMission: function (a, b) {
      var c = a.resultData,
      e = c.code;
      '0000' == e || '0003' == e ? (0 === b.indexOf('bk.jd.com/m') ? window.location.href = 'https://bk.jd.com/m' : setTimeout(function () {
        window.location.href = b
      }, 50), d.hideSimplePop())  : d.systemPop('任务领取失败，请稍后再试哦~')
    },
    getSign: function (a) {
      if (!a.resultData) return !1;
      var c = {
        hasSign: '已签到',
        needLoginText: '登录后有惊喜'
      },
      d = {
        resultData: a.resultData[53],
        login: {
          checkIsLogin: function () {
            return d.resultData.suitable ? !0 : !1
          },
          toLogin: function () {
            this.login || e.unifyAppLogin()
          },
          loginForSuprise: function () {
            var a = this;
            b('#appSign-draw-text,#appSign-btn').click(function () {
              a.toLogin()
            })
          }
        },
        drawStr: function () {
          if (this.login.checkIsLogin()) {
            var a = '<span class="suitable">宜<i class="point"></i>' + this.resultData.suitable + '</span> ',
            b = '<span class="unsuited">忌<i class="point"></i>' + this.resultData.dread + '</span>';
            return a + b
          }
          return this.login.loginForSuprise(),
          c.needLoginText
        },
        appendDraw: function () {
          b('#appSign-draw-text').empty().append(this.drawStr())
        },
        setDay: function () {
          b('#appSign-day').text(this.resultData.todayDate).removeClass('getIn').addClass('animated bounceInDown')
        },
        setYearAndMonth: function () {
          b('#appSign-yearAndMonth').text(this.resultData.yearAndMonth + ' ' + this.resultData.weeksTime)
        },
        setSignBtn: function () {
          1 === this.resultData.signInStatus && b('#appSign-btn').text(c.hasSign)
        },
        showSignResult: function () {
          b('.appSign-switch').removeClass('hide')
        },
        sign: function () {
          var a = this;
          b('#appSign-btn').click(function () {
            null === b(this).attr('qyy-stop-click') ? h.init(qyy.actionMap.baseSignInEncrypt, 'post', 'json', g.beReqdata({
            }), !0, a.signCallback)  : a.showSignResult()
          })
        },
        signCallback: function (a) {
          if (!a.resultData) return !1;
          var d = {
            resultData: a.resultData,
            showBannerAndSwitch: function () {
              b('#appSign-sign-banner,#appSign-display-switch').removeClass('hide')
            },
            comPrizeStr: function () {
              return 0 === this.resultData.statusCode && this.resultData.isSuccess ? '成功获得 <span class="red" id="appSign-gb-count">' + this.resultData.thisAmount + '</span> ' + this.resultData.prizeName : '<p class="reward">' + this.resultData.showMsg + '</p>'
            },
            setClickSwitch: function () {
              (14 === this.resultData.statusCode || 15 === this.resultData.statusCode) && b('#appSign-btn').text(c.hasSign).attr('qyy-stop-click', ''),
              0 === this.resultData.statusCode && b('#appSign-btn').text(c.hasSign)
            },
            continuitySignStr: function () {
              return this.resultData.continuityDays > 1 ? '，已连续签到 <span class="red" id="appSign-days">' + this.resultData.continuityDays + '</span> 天' : ''
            },
            extraPrizeStr: function () {
              return this.resultData.isContinuity ? '获得额外奖励 <span class="red" id="appSign-gb-more">' + this.resultData.continuityAmount + '</span> ' + this.resultData.additionalPrizeName : ''
            },
            appendSignResult: function () {
              var a = '<p class="reward">' + this.comPrizeStr() + this.continuitySignStr() + '</p><p class="extra">' + this.extraPrizeStr() + '</p>';
              b('#appSign-gb-wrap').empty().append(a).removeClass('hide')
            },
            init: function () {
              this.showBannerAndSwitch(),
              this.appendSignResult(),
              this.setClickSwitch()
            }
          };
          d.init()
        },
        eventGoback: function () {
          b('.appSign').on('click', '#appSign-display-switch', function () {
            b('.appSign-switch').addClass('hide')
          })
        },
        init: function () {
          this.setDay(),
          this.setYearAndMonth(),
          this.appendDraw(),
          this.setSignBtn(),
          this.eventGoback(),
          this.login.checkIsLogin() && this.sign()
        }
      };
      d.init()
    }
  };
  a._ajax = h
}(window, Zepto);
var tools = $.tools;
!function (a, b) {
  var c = a._ajax,
  d = b.tools,
  e = d.getCookie('sid');
  ('' === e || null === e) && (e = d.getString('sid')),
  a.memberMission = {
    checkName: function () {
      location.href = qyy.links.checkNameV1
    },
    popCheckName: function (a) {
      if (2 === parseInt(a)) return !0;
      if (qyy.isJrUser) return !0;
      if (40 === parseInt(d.getString('missionId'))) return !0;
      var c = {
        img90: 'images/dailogue_icon_identifiaction.png',
        title1: '请先开通实名认证',
        label_desc2: '您的账户尚未实名，无法完成此任务，请先前往实名认证。完成后还可领30元支付礼包！',
        btn: '关闭',
        btn2: '去实名'
      },
      e = popUi.simplePop(c);
      return popUi.showSimplePop(e),
      b('#qyy-button_check_name').click(function () {
        memberMission.checkName()
      }),
      !1
    },
    initMemberMissionEvent: function (a) {
      return 0 === a.parents('.section-34').length ? !0 : a.hasClass('orange') ? !1 : a.hasClass('needAjax') ? !1 : a.hasClass('gray') ? !1 : a.hasClass('blue') ? !1 : void 0
    },
    assembleUserData: function (a) {
      var b = {
      },
      a = a,
      c = '';
      return 1 == d.checkUrlStatus() ? c = 'APP_TEST' : d.isWeiXin() ? c = 'WX_Q' : d.isJDApp() ? (c = 'JD_APP', d.isIos() || (c = 'JD_APP_ANDROID'))  : c = d.isPc() ? 'PC' : d.isApp() ? 'JR_APP' : 'M',
      b = d.isApp() ? {
        missionId: a,
        channel: c
      }
       : {
        missionId: a,
        channel: c
      }
    },
    bindPopFloat: function () {
      qyy.$obj.body.children().on('click', '.info-wrap', function () {
        var a = b(this).parents('.member-mission-all'),
        c = (a.find('.info-btn'), a.attr('data-qyy-frequencytype')),
        d = a.attr('data-areaShow'),
        e = a.attr('data-qyy-status');
        if (!memberMission.popCheckName(d)) return !1;
        var f = {
          img: a.find('.icon').attr('src'),
          title: a.attr('data-qyy-title'),
          subtitle: a.attr('data-qyy-awardName'),
          label: '任务说明',
          label_desc: a.attr('data-qyy-desc'),
          label1: '当前状态',
          label_desc1: a.attr('data-qyy-statusText'),
          scheduleShowValue: a.attr('data-qyy-scheduleShowValue'),
          progress: !1,
          btn: '关闭',
          btn1: a.find('.info-btn').text()
        };
        if ('0' === e && parseInt(a.attr('data-qyy-scheduleTargetValue')) > 0 && (f.progress = !0), '0' != e && parseInt(a.attr('data-qyy-scheduleTargetValue')) > 0 && (f.scheduleShowValue = ''), 0 != a.attr('data-qyy-frequencyType')) {
          var g = [
            '',
            '日任务',
            '周任务',
            '月任务'
          ];
          f.topLabel = g[a.attr('data-qyy-frequencyType')]
        }
        if (0 != c && '2' === e) {
          var h = [
            '',
            '当日',
            '当周',
            '当月'
          ];
          f.label_desc1 = h[c] + f.label_desc1
        }
        '2' === e && (f.topImg = 'images/md/dialogue_finish.png');
        var i = popUi.simplePop(f);
        popUi.showSimplePop(i),
        '1' === e ? b('#qyy-button_jump').addClass('orange')  : '2' === e && b('#qyy-button_jump').remove();
        var j = b(this).next().children('.info-btn').attr('data-qyy-missionid');
        b('#qyy-button_jump').attr({
          'data-qyy-missionid': j,
          'data-areaShow': d
        })
      })
    },
    bindGetPrize: function () {
      qyy.$obj.body.children().on('click', '.info-btn,.mission-btn,#qyy-button_jump', function () {
        var a = b(this),
        e = '',
        f = a.parents('.member-mission-all').attr('data-areaShow') || a.attr('data-areaShow'),
        g = {
        };
        return memberMission.popCheckName(f) ? ('qyy-button_jump' === b(this).attr('id') && (e = b(this).attr('data-qyy-missionId'), a = b('span[data-qyy-missionid="' + e + '"]')), void (a.hasClass('check-name') ? memberMission.checkName()  : a.hasClass('do-mission') ? (g = memberMission.assembleUserData(a.attr('data-qyy-missionId')), c.init(qyy.actionMap.outH5ReceiveMission, 'post', 'json', d.beReqdata(g), !0, c.getMemberMission, a.attr('data-qyy-jumpt')))  : a.hasClass('get-prize') ? (g = memberMission.assembleUserData(a.attr('data-qyy-missionId')), c.init(qyy.actionMap.outH5RewardMission, 'post', 'json', d.beReqdata(g), !0, c.getMemberPrize, a))  : a.hasClass('doing-mission') && setTimeout(function () {
          window.location.href = a.attr('data-qyy-jumpt')
        }, 50)))  : !1
      })
    },
    bindCloseFloat: function () {
      qyy.$obj.body.children().on('click', '#qyy-pop_com_button,#qyy-button_cancel', function () {
        'button_success' === b(this).attr('id') && main.requestAllInfo(),
        popUi.hideSimplePop()
      })
    },
    bindCloseFloatAndReload: function () {
      qyy.$obj.html.children().on('click', '#qyy-button_success', function () {
        setTimeout(function () {
          window.location.reload()
        }, 150)
      })
    },
    bindMemberBalanceRemind: function () {
      qyy.$obj.html.children().on('click', '.member-product .count-icon', function () {
        event.stopPropagation();
        var a = {
          title1: b(this).parents('.item').find('.title').html(),
          label_desc: b(this).attr('data-qyy-desc'),
          btn: '关闭'
        };
        b('.pop_com_wrap').remove();
        var c = popUi.simplePop(a);
        popUi.showSimplePop(c)
      })
    },
    init: function () {
      memberMission.bindGetPrize(),
      memberMission.bindCloseFloat(),
      memberMission.bindCloseFloatAndReload(),
      memberMission.bindMemberBalanceRemind(),
      memberMission.bindPopFloat()
    }
  },
  memberMission.init()
}(window, Zepto),
function (a, b) {
  var c = b.tools,
  d = a.popUi,
  e = a.CountDown,
  f = a.scrollNotice,
  g = a.checkAjax,
  h = a._ajax;
  qyy.isQyyOut && g.init(0 != b('.qyy-body').length ? g.getSuccessData({
    type: '2'
  })  : g.getErrorData({
    type: '2'
  }));
  var i = (c.getString('pin'), c.getString('qingfrom')),
  j = a.memberMission,
  k = {
    initPage: function () {
      var a = {
        userType: qyy.userType
      };
      h.init(qyy.actionMap.getPageInfo, 'post', 'json', c.beReqdata(a), !1, h.initPage, '', 1),
      1 === qyy.isReturnTop && this.initReturnTop()
    },
    requestAllInfo: function () {
      d.showLoading();
      var a = {
      },
      e = c.getDeviceId();
      a = {
        clientType: 'outH5',
        userType: qyy.userType,
        missionPlatformsEnumCode: c.getClientType(),
        sid: qyy.sid,
        deviceId: e
      },
      h.init(qyy.actionMap.getAllInfo, 'post', 'json', c.beReqdata(a), !1, h.loadAllFloor),
      k.initEventAndSetCookie(),
      k.initMemberBalance(),
      k.initMemberMission(),
      this.initIsHasFixed(),
      this.initExitLogin(),
      this.initGroupData(),
      this.initMenuList(),
      this.initWeixinFloat(),
      this.initCountDown(),
      this.initScrollNotice(),
      this.initJdHeader(),
      this.introduceSource(),
      this.initFixedBtn(),
      setTimeout(function () {
        if (d.hideLoading(), qyy.isEnterInLoaing = !1, !qyy.isActionErr) {
          d.enterInAnimation();
          var a = 0 === b('.swiper-container').length ? !1 : !0;
          a && ('undefined' == typeof Swiper ? b.tools.loadSource('//m.jr.jd.com/spe/qyy/main/js/libs/swiper-3.4.0.jquery.min.js', 'script', 'qyy-swiper-js', function () {
            k.initGallery()
          })  : k.initGallery()),
          k.imgLazyLoad(),
          setTimeout(function () {
            k.initBigBanner(),
            k.initGostBtn()
          }, 100)
        }
      }, 50)
    },
    initScrollNotice: function () {
      b('.auto-notice').each(function () {
        var a = b(this).attr('id'),
        c = b(this).children('.auto-notice-wrap').attr('id');
        setTimeout(function () {
          f(a, c)
        }, 1800)
      })
    },
    initMemberBalance: function () {
      var a = b('.member-product'),
      c = a.find('.item').length;
      c > 3 && (a.after('<div class="row member-product-more"><img src="' + qyy.imgHost + 'images/shap black.png" alt=""></div>'), qyy.$obj.html.on('click', '.member-product-more', function () {
        a.addClass('show-more'),
        b(this).remove()
      }))
    },
    initMemberMission: function () {
      var a = b('.section-34 .member-mission-all'),
      c = a.length,
      d = b('#qyy-data-input').data('34');
      if (0 != d) {
        a.eq(d - 1).addClass('no-bb');
        for (var e = d; c > e; e++) a.eq(e).addClass('hide')
      }
    },
    initReturnTop: function () {
      var a = '<span class="go-top" id="qyy-go-top"><img src="' + qyy.imgHost + 'images/go_top.png" alt=""></span>';
      b('body').append(a),
      b('#qyy-go-top').on('click', function () {
        var a = !0,
        c = setInterval(function () {
          var a = document.getElementsByTagName('body') [0].scrollTop,
          b = 0;
          a > 0 ? (b = a > 500 ? 30 : a > 300 ? 28 : a > 150 ? 32 : 28, document.getElementsByTagName('body') [0].scrollTop -= b)  : clearInterval(c)
        }, 1);
        b('body').on('touchstart', function () {
          a && (clearInterval(c), b(this).off('touchstart'), a = !1)
        })
      }),
      b(window).scroll(function () {
        b(this).scrollTop() > 500 ? b('#qyy-go-top').show()  : b('#qyy-go-top').hide()
      }),
      b('#qyy-go-top').hide()
    },
    initGallery: function () {
      for (var a = b('.swiper-container-focus'), c = b('.swiper-pagination'), d = a.length, e = [
      ], f = 0, g = 0; d > g; g++) {
        b(a[g]).attr('id', 'swiper-container-focus-' + g),
        b(c[g]).attr('class', 'swiper-pagination swiper-pagination-' + g);
        var h = !0,
        i = b(a[g]).hasClass('row-124') || b(a[g]).hasClass('row-125'),
        j = b(a[g]).find('img').length;
        i ? j > 2 && (e[g] = new Swiper('#swiper-container-focus-' + g, {
          pagination: h ? '.swiper-pagination-' + g : null,
          paginationClickable: !0,
          initialSlide: 0,
          observer: !0,
          observeParents: !0,
          dataIndex: f,
          paginationBulletRender: function (a, b, c) {
            return '<span class="' + c + '">' + qyy.tabProducts.skuMenuMap[this.dataIndex][b] + '</span>'
          }
        }), f++)  : j > 1 && (e[g] = new Swiper('#swiper-container-focus-' + g, {
          pagination: '.swiper-pagination-' + g,
          paginationClickable: !0,
          initialSlide: 0,
          loop: !0,
          loopAdditionalSlides: j,
          observer: !0,
          observeParents: !0,
          autoplay: 2500,
          speed: 1000,
          autoplayDisableOnInteraction: !1
        }))
      }
      new Swiper('.swiper-container-banner', {
        slidesPerView: 'auto',
        paginationClickable: !0,
        spaceBetween: 10,
        freeMode: !0,
        observer: !0,
        observeParents: !0
      }),
      new Swiper('.swiper-container-ImgProduct', {
        slidesPerView: 'auto',
        paginationClickable: !0,
        spaceBetween: 12,
        freeMode: !0,
        observer: !0,
        observeParents: !0
      }),
      new Swiper('.swiper-container-single', {
        slidesPerView: 'auto',
        paginationClickable: !0,
        spaceBetween: 10,
        freeMode: !0,
        observer: !0,
        observeParents: !0
      })
    },
    imgLazyLoad: function () {
      var a = window.screen.height;
      qyy.isQyyOut ? b('.test-lazyload').each(function () {
        b(this).attr({
          src: b(this).attr('data-qyy-original')
        }),
        b(this) [0].onload = function () {
          b(this).parent().addClass('bg-none min-height-0'),
          b(this).removeAttr('data-qyy-original'),
          qyy.isQyyOut && b(this).hasClass('check-load-status') && g.init(1 == b(this) [0].complete ? g.getSuccessData({
            type: '3'
          })  : g.getErrorData({
            type: '3'
          }))
        }
      })  : b('.test-lazyload').picLazyLoad({
        threshold: a,
        placeholder: qyy.links.imgPlaceHoldUrl
      })
    },
    initEventAndSetCookie: function () {
      var a = {
        initCom: function () {
          qyy.$obj.html.on('click', '[data-qyy-click]', function () {
            function a(a) {
              var b = window.location.href,
              d = c.transmitParam(/qingfrom/, 'qingfrom', b, a, i);
              return d
            }
            if ('on' != b(this).attr('jrmsc')) return !1;
            if (1 === b(this).parents('.member-mission-all').length) return j.init(b(this).parents('.section')),
            !1;
            1 === b(this).parents('.section-44').length && b('.section-44').css('display', 'none');
            var d = b(this),
            e = d.attr('clstag'),
            f = d.attr('jrmsc'),
            g = d.attr('data-qyy-jumpt'),
            h = d.attr('data-qyy-ejumpType');
            - 1 === g.indexOf('http:') && - 1 === g.indexOf('https:') && (g = location.protocol + g),
            'on' === f && b.tools.setCookie('jrmclicknode', e, {
              expires: 1
            });
            var l = c.getString('sid'),
            m = '' === l || null === l ? !1 : !0,
            n = null === i || '' === i ? !1 : !0;
            if (1 === b(this).parents('.section-38').length) {
              var o = (b(this).attr('data-qyy-eid'), b(this).attr('data-qyy-eredId'));
              0 != parseInt(o) && b.tools.setCookie('qyy' + o, o, {
                expires: 9999
              })
            }
            setTimeout(function () {
              var b = g;
              switch (h) {
                case '0':
                  break;
                case '1':
                  b = m ? n ? a(g + qyy.sid)  : g + qyy.sid : n ? a(g)  : g;
                  break;
                case '2':
                  b = n ? a(g)  : g;
                  break;
                case '3':
                  b = m ? n ? a(g + qyy.sid)  : g + qyy.sid : qyy.links.mLogin + (n ? a(g)  : g);
                  break;
                case '8':
                  b = n ? a(g + qyy.sid)  : g + qyy.sid;
                  break;
                case '9':
                  b = n ? a(g + qyy.sid)  : g + qyy.sid;
                  break;
                case '10':
                  b = n ? a(g + qyy.sid)  : g + qyy.sid;
                  break;
                case '11':
                  b = n ? a(g + qyy.sid)  : g + qyy.sid
              }
              0 != h && (k.qyyExposure(), location.href = b)
            },
            50)
          })
        },
        init: function () {
          a.initCom()
        }
      };
      a.init()
    },
    initIsHasFixed: function () {
      if (qyy.hasFixedTop) {
        var a = '';
        a = qyy.hasComFixedTop ? '<div class="download-app-seize h116 ' + qyy.fixedTopSeizeClass + '" style="" ></div>' : '<div class="download-app-seize" style="" ></div>',
        b('body').prepend(a)
      }
      if (qyy.hasFixedBottom) {
        var a = '<div class="add-bottom-seize"></div>';
        b('body').append(a)
      }
      var c = {
        init: function () {
          var a = '<div class="black-cover" id="qyy-black-cover"></div>';
          qyy.$obj.body.append(a),
          b('#qyy-black-cover').hide(),
          qyy.$obj.html.on('click', '#qyy-add-top-right,#qyy-black-cover', function () {
            b('#qyy-personal-list').toggle(),
            b('#qyy-black-cover').toggle()
          }),
          qyy.$obj.html.on('click', '#add-top-left', function () {
            history.go( - 1)
          })
        }
      },
      d = {
        $bottomList: [
          b('.section-46'),
          b('.row-55')
        ],
        init: function () {
          b.each(this.$bottomList, function (a, c) {
            if (0 != c.length) {
              if (0 != b('.add-bottom-seize').length) return;
              var d = '<div class="add-bottom-seize"></div>';
              b('body').append(d)
            }
          })
        }
      };
      c.init(),
      d.init()
    },
    initExitLogin: function () {
      b('#qyy-logout').removeAttr('data-qyy-click'),
      qyy.$obj.html.on('click', '#qyy-logout', function () {
        function a() {
          function a(a) {
            window.location.href = 0 == a.errcode ? qyy.links.mLogin + encodeURIComponent(c)  : qyy.links.mLogin + encodeURIComponent(c)
          }
          var b = 'm.jd.com',
          d = 100;
          p_logout.logout(a, b, d)
        }
        var c = b(this).attr('data-qyy-exiturl');
        - 1 === c.indexOf('http:') && - 1 === c.indexOf('https:') && (c = window.location.protocol + c),
        a()
      })
    },
    initGroupData: function () {
      function a(a, b) {
        var d = {
          clientType: 'outH5',
          userType: qyy.userType,
          groupType: a
        },
        e = qyy.actionMap.baseGetMessByGroupTypeEncrypt;
        154 === a && (e = qyy.actionMap.baseGetMessByGroupType),
        h.init(e, 'post', 'json', c.beReqdata(d), !0, b, '', 3)
      }
      var d = {
        '.section-4': [
          4,
          h.getUserTel
        ],
        '.row-32': [
          32,
          h.getUserGroupData
        ],
        '.member-product': [
          33,
          h.getMemberProductGroupData
        ],
        '.section-35': [
          35,
          h.getWeixinBalance
        ],
        '.section-36': [
          36,
          h.getTopUserHeaderData
        ],
        '.section-42': [
          42,
          h.getAssetsGroupData
        ],
        '.section-154': [
          154,
          h.getSign
        ]
      };
      for (var e in d) if (0 != b(e).length) {
        var f = d[e][0],
        g = d[e][1];
        a(f, g)
      }
    },
    initMenuList: function () {
      for (var a = b('.menu'), c = 0; c < a.length; c++) {
        var d = a.eq(c).find('.item'),
        e = d.length;
        d.css('width', 1 / e + '100%')
      }
    },
    initWeixinFloat: function () {
      qyy.$obj.html.on('touchstart', '.count, .xiaobai .title, .bankcard .title', function () {
        if (0 != b(this).find('.count-icon').length) {
          var a = b(this).find('.count-icon'),
          c = b(this).attr('data-qyy-title'),
          e = a.attr('data-qyy-desc'),
          f = {
            title1: c,
            label_desc: e,
            btn: '关闭'
          };
          b('.pop_com_wrap').remove();
          var g = d.simplePop(f);
          d.showSimplePop(g)
        }
      }),
      qyy.$obj.html.on('click', '.pop_com_button,.button-right', function () {
        d.hideSimplePop()
      })
    },
    initCountDown: function () {
      for (var a = [
      ], c = [
      ], d = b('.countdown .text'), f = d.length, g = 0; f > g; g++) {
        var h = d.eq(g).attr('data-qyy-countDown-endTime'),
        i = d.eq(g);
        a[g] = new e(c[g], h, i),
        a[g].init(),
        function () {
          var b = g;
          c[g] = setInterval(function () {
            a[b].initDom(),
            a[b].needClear && clearInterval(c[b])
          }, 300)
        }()
      }
    },
    initBigBanner: function () {
      var a = c.getCookie('bigBannerValue_' + qyy.userType),
      d = 0;
      if (document.getElementById('qyy-big-banner') && (d = b('#qyy-big-banner').attr('data-qyy-cookieid')), a != d && (c.setCookie('bigBannerValue_' + qyy.userType, d, {
        expires: 9999
      }), 0 != b('.section-44').length)) {
        var e = b('.section-44');
        b('.section-44').remove(),
        b('.wrap-container').append(e);
        var f = b('.section-44');
        0 != b('.jr-header').length && f.addClass('has-header-top'),
        f.css({
          display: 'block'
        });
        var g = f.height(),
        h = f.width(),
        i = 77.87;
        i = 0.745 > h / g ? 77.87 : 40;
        var j = i * g / 687 + '%';
        c.isIos() ? 375 === h && (j = '77.87%')  : j = i * (g - 50) / 687 + '%',
        b('.big-banner').css({
          width: j
        }),
        b('#qyy-big-banner-close').click(function () {
          f.css('display', 'none')
        })
      }
    },
    initGostBtn: function () {
      c.hasDom(b('#qyy-gost-btn')) && b('#qyy-gost-btn').removeClass('hide')
    },
    initFixedBtn: function () {
      function a() {
        b('.section-45,.download-app-seize').addClass('hide')
      }
      function d() {
        b('.section-46,.add-bottom-seize').addClass('hide')
      }
      var e = b('#qyy-fixed-top-com'),
      f = b('#qyy-fixed-bottom-com'),
      g = e.attr('data-qyy-eid'),
      h = f.attr('data-qyy-eid'),
      i = c.getCookie('s45' + g),
      j = c.getCookie('s46' + h);
      c.hasDom(b('.section-45')) && ('true' === i ? a()  : b('#qyy-fixed-top-com').click(function () {
        a(),
        c.newSetCookie('s45' + g, !0, {
          expires: '24h'
        })
      })),
      c.hasDom(b('.section-46')) && ('true' === j ? d()  : b('#qyy-fixed-bottom-com').click(function () {
        d(),
        c.newSetCookie('s46' + h, !0, {
          expires: '24h'
        })
      }))
    },
    initJdHeader: function () {
      if (1 === parseInt(c.getString('jdm'))) {
        for (var a = [
          '//st.360buyimg.com/m/js/2014/module/plugIn/downloadAppPlugIn_imk2.js',
          '//st.360buyimg.com/common/commonH_B/js/m_common2.1.js',
          '//st.360buyimg.com/common/commonH_B/js/m_common_header_bottom2.1.js'
        ], b = [
          '//st.360buyimg.com/common/commonH_B/css/header.css'
        ], d = 0, e = 0; e < b.length; e++) {
          var f = document.createElement('link');
          f.href = b[e],
          f.id = 'jdHeaderCss' + e,
          f.rel = 'stylesheet',
          document.getElementsByTagName('body') [0].appendChild(f)
        }
        for (var e = 0; e < a.length; e++) {
          var f = document.createElement('script');
          f.src = a[e],
          f.id = 'jdHeaderJs' + e,
          document.getElementsByTagName('body') [0].appendChild(f),
          document.getElementById('qyy-jdHeaderJs' + e).onload = function () {
            d++,
            3 === d && !function (a, b) {
              function c() {
                var a = d.getCookie('sid'),
                c = new MCommonHeaderBottom,
                e = b('#qyy-web-title').text(),
                f = {
                  hrederId: 'm_common_header',
                  title: e,
                  sid: a,
                  isShowShortCut: !1,
                  selectedShortCut: '4'
                };
                c.header(f)
              }
              var d = b.tools,
              e = '<div id="qyy-m_common_header" class="hide" style="min-height:45px;"></div>';
              b('body').prepend(e),
              c(),
              b('#qyy-m_common_header,#qyy-m_common_bottom6').removeClass('hide')
            }(window, Zepto)
          }
        }
      }
    },
    introduceSource: function () {
      47 === qyy.userType && c.loadSource(qyy.resource.vip, 'script', 'resource-vip', void 0),
      (60 === qyy.userType || 2018 === qyy.userType) && c.loadSource(qyy.resource.balance, 'script', 'resource-balance', void 0)
    },
    qyyExposure: function () {
      function a() {
      }
      if (!qyy.isQyyOut) return !1;
      var c = {
        h5BusinessType: 'qyy',
        sid: qyy.sid,
        pin: b.tools.getCookie('pin'),
        userType: qyy.userType
      };
      h.init(qyy.actionMap.qyyExposure, 'post', 'json', c, !1, a)
    },
    init: function () {
      this.initPage(),
      this.requestAllInfo(),
      this.qyyExposure()
    }
  };
  k.init()
}(window, Zepto),
window.jQuery = window.Zepto;
var _jraq = _jraq || [
];
_jraq.push(['account',
'UA-J2011-12']),
function () {
  var a = document.createElement('script');
  a.type = 'text/javascript',
  a.async = !0,
  a.src = ('https:' == document.location.protocol ? 'https://jrclick' : 'http://jrclick') + '.jd.com/wl.dev.js';
  var b = document.getElementsByTagName('script') [0];
  b.parentNode.insertBefore(a, b)
}();
var jaq = jaq || [
];
jaq.push(['account',
'UA-J2011-12']),
jaq.push(['domain',
'jr.jd.com']),
function () {
  var a = document.createElement('script');
  a.type = 'text/javascript',
  a.async = !0,
  a.src = ('https:' == document.location.protocol ? 'https://cscssl' : '//csc') + '.jd.com/joya.js';
  var b = document.getElementsByTagName('script') [0];
  b.parentNode.insertBefore(a, b)
}(),
function () {
}(window, Zepto);
