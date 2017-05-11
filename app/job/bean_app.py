import random
import traceback

import util
from .daka import Daka


class BeanApp(Daka):
    """
    京东客户端签到领京豆. 由于是 App (Mobile) 端页面, 登录方式与领钢镚的相同, 不同于电脑端领京豆.
    """
    job_name = '京东客户端签到领京豆'

    index_url = 'https://ld.m.jd.com/userBeanHomePage/getLoginUserBean.action'
    sign_url = 'https://ld.m.jd.com/SignAndGetBeansN/signStart.action'
    poker_url = 'https://ld.m.jd.com/card/getCardResult.action'

    test_url = index_url

    def is_signed(self):
        r = self.session.get(self.index_url)
        signed = False

        if r.ok:
            sign_pattern = r'"signStatval".*?value="(\d+)"'
            days_pattern = r'"signNum".*?value="(\d+)"'
            dou_pattern = r'"dou".*?value="(\d+)"'

            try:
                # https://h.360buyimg.com/getbean/js/jdBeanNew.js
                # 2 表示已签到, 4 表示未签到
                signed = ('2' == util.find_value(sign_pattern, r.text))
                sign_days = util.find_value(days_pattern, r.text)
                dou_count = util.find_value(dou_pattern, r.text)
                self.logger.info('今日已签到: {}; 签到天数: {}; 现有京豆: {}'.format(signed, sign_days, dou_count))

            except Exception as e:
                self.logger.error('返回数据结构可能有变化, 获取签到数据失败: {}'.format(e))
                traceback.print_exc()

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
