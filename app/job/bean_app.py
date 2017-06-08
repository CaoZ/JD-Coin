import random
import traceback

from .daka import Daka


class BeanApp(Daka):
    """
    京东客户端签到领京豆. 由于是 App (Mobile) 端页面, 登录方式与领钢镚的相同, 不同于电脑端领京豆.
    """
    job_name = '京东客户端签到领京豆'

    index_url = 'https://bean.m.jd.com'
    info_url = 'https://api.m.jd.com/client.action?functionId=queryBeanIndex'
    sign_url = 'https://ld.m.jd.com/SignAndGetBeansN/signStart.action'
    test_url = 'https://home.m.jd.com'
    poker_url = 'https://ld.m.jd.com/card/getCardResult.action'

    def is_signed(self):
        payload = {
            'client': 'ld',
            'clientVersion': '1.0.0'
        }

        response = self.session.get(self.info_url, params=payload).json()
        signed = False

        if response['code'] == '0':
            data = response['data']

            # 以前的 js: https://h.360buyimg.com/getbean/js/jdBeanNew.js
            # 现在的, 根据测试, 2 表示已签到, 4 表示未签到, 5 表示未登录
            signed = (data['status'] == '2')
            sign_days = int(data['continuousDays'])
            beans_count = int(data['totalUserBean'])

            self.logger.info('今日已签到: {}; 签到天数: {}; 现有京豆: {}'.format(signed, sign_days, beans_count))

        else:
            error_msg = response.get('echo') or str(response)
            self.logger.error('签到信息获取失败: {}'.format(error_msg))

        return signed

    def sign(self):
        r = self.session.get(self.sign_url)
        sign_success = False

        if r.ok:
            as_json = r.json()
            sign_success = (as_json['status'] == 1)
            message = as_json['signText']
            self.logger.info('签到成功: {}; Message: {}'.format(sign_success, message))

            poker = as_json['poker']
            # "complated": 原文如此, 服务端的拼写错误...
            poker_picked = poker['complated']

            if not poker_picked:
                self.pick_poker(poker)

        else:
            self.logger.error('签到失败: Status code: {}; Reason: {}'.format(r.status_code, r.reason))

        return sign_success

    def pick_poker(self, poker):
        poker_to_pick = random.randint(1, len(poker['awardList']))
        r = self.session.get(self.poker_url, params={'index': poker_to_pick})
        pick_success = False

        try:
            as_json = r.json()
            pick_success = (as_json['drawStatus'] == 0)
            message = as_json.get('signText') or as_json['drawText']
            self.logger.info('翻牌成功: {}; Message: {}'.format(pick_success, message))

        except Exception as e:
            self.logger.error('翻牌失败: {}'.format(e))
            traceback.print_exc()

        return pick_success
