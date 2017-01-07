import logging
import traceback

import util
from .daka import Daka


class BeanApp(Daka):
    """
    京东客户端签到领京豆. 由于是 App (Mobile) 端页面, 登录方式与领钢镚的相同, 不同于电脑端领京豆.
    """
    job_name = '京东客户端签到领京豆'

    index_url = 'https://ld.m.jd.com/userBeanHomePage/getLoginUserBean.action'
    sign_url = 'https://ld.m.jd.com/SignAndGetBeans/signStart.action'
    test_url = index_url

    def is_signed(self):
        r = self.session.get(self.index_url)
        signed = False

        if r.ok:
            sign_pattern = r'"signStatval".*?value="(\d+)"'
            days_pattern = r'"signNum".*?value="(\d+)"'

            try:
                # https://h.360buyimg.com/getbean/js/jdBeanNew.js
                # 2 表示已签到, 4 表示未签到
                signed = ('2' == util.find_value(sign_pattern, r.text))
                sign_days = int(util.find_value(days_pattern, r.text))
                print('# 今日已签到: {}; 签到天数: {}'.format(signed, sign_days))

            except Exception as e:
                logging.error('# 返回数据结构可能有变化, 获取签到数据失败: {}'.format(e))
                traceback.print_exc()

        return signed

    def sign(self):
        r = self.session.get(self.sign_url)
        sign_success = False

        if r.ok:
            as_json = r.json()
            status = as_json['status']

            if status == 1:
                sign_success = True
                beans_count = as_json['todayGetBeansCounts']
                print('# 签到成功; 获得 {} 个京豆.'.format(beans_count))

            else:
                print('# 签到失败; status: {}'.format(status))

        else:
            print('# 签到失败: Status code: {}; Reason: {}'.format(r.status_code, r.reason))

        return sign_success


"""
    case 1: //成功
        $("#authCodeInput").attr("value","");
        var message = "签到成功，今日已领<strong style='color:red;'>" + results.todayGetBeansCounts + "</strong>京豆";
        loadCalendarPopupBox(results.dayslist,message,true,result.todayGetBeansCounts);
        break;
    case 2: //已签过返回今天不可以签
        $("#authCodeInput").attr("value","");
        //alert("今天已经签过到啦，不可以再签了呦");
        $('#messageAlert').bind("touchmove",function(e){
            e.preventDefault();
        });
        $("#messageText").text("今天已经签过到啦，不可以再签了呦");
        $("#messageAlert").show();
        history.go(0);
        break;
    case 3: //京豆已领完
        $("#authCodeInput").attr("value","");
        $("#mybeanButtonClass").attr("class","btn sign-error-btn J_ping");
        $("#mybeanButtonClass").removeAttr("id");
        //$("#mybeanButtonText").text("已结束");
        var message = '<span class="f-red">签到簿已满，明天早点来哦</span>';
        loadCalendarPopupBox(results.dayslist,message,false,0);
        break;
    case 4: //重定向到拼图
        window.parent.location.href =  "//" + window.location.host + "/pintu.action?sid=" +sid ;
        break;
    case 5: //验证码验证失败 刷新验证码
        $("#authCodeInput").attr("value","");
        $("#yanzhengmaText").text("验证码错误，请重新输入");
        $("#authCodeImg").click();
        $("#authCode").show();
        break;
    case 6://发送京豆失败
        $("#authCodeInput").attr("value","");
        //alert("网络错误，请稍后重试");
        $('#messageAlert').bind("touchmove",function(e){
            e.preventDefault();
        });
        $("#messageText").text("当前签到人数较多，稍晚再来");
        $("#messageAlert").show();
        break;
    case 7://发送京豆不足
        $("#authCodeInput").attr("value","");
        var message = '<span class="f-red">京豆数量不足，明天早点来哦</span>'
        loadCalendarPopupBox(results.dayslist,message,false,0);
        break;
    case 8: //系统异常
        $("#authCodeInput").attr("value","");
        //alert("网络错误，请稍后重试");
        $('#messageAlert').bind("touchmove",function(e){
            e.preventDefault();
        });
        $("#messageText").text("请重新进入领京豆");
        $("#messageAlert").show();
        break;
    case 9://验证码开启
        $("#businessIdVal").attr("value",results.businessId);
        var statval=$("#signStatval").val();
        if(statval==4){
            $('html,body').animate({scrollTop: '0px'}, 100);//因为页面很长，有纵向滚动条，先让页面滚动到最顶端，然后禁止滑动事件，这样可以使遮罩层锁住整个屏幕
            $('#authCode').bind("touchmove",function(e){
                e.preventDefault();
            });
            $("#authCode").show();
        }
        break;
    case 11://刷新页面
        history.go(0);
        break;
"""
