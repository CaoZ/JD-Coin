import logging
import traceback

import util
from .daka import Daka


class DakaApp(Daka):
    job_name = '京东客户端钢镚打卡'

    index_url = 'https://bk.jd.com/m/jdapp/daka/index.html'
    sign_url = 'https://bk.jd.com/m/jdapp/daka/daka.html?dakaActType=JD_APP_V5'
    test_url = 'https://bk.jd.com/m/jdapp/daka/dakDetail.html'

    def is_signed(self):
        r = self.session.get(self.index_url)
        signed = False

        if r.ok:
            daka_pattern = r'dakaed:\s*(\w+)'
            days_pattern = r'dakaNumber:\s*(\d+)'

            try:
                signed = ('true' == util.find_value(daka_pattern, r.text))
                sign_days = int(util.find_value(days_pattern, r.text))
                print('# 今日已打卡: {}; 打卡天数: {}'.format(signed, sign_days))

            except Exception as e:
                logging.error('# 返回数据结构可能有变化, 获取打卡数据失败: {}'.format(e))
                traceback.print_exc()

        return signed

    def sign(self):
        r = self.session.get(self.sign_url)
        sign_success = False

        if r.ok:
            as_json = r.json()
            sign_success = as_json['success']
            message = as_json['resultMessage']
            print('# 打卡成功: {}; Message: {}'.format(sign_success, message))

        else:
            print('# 打卡失败: Status code: {}; Reason: {}'.format(r.status_code, r.reason))

        return sign_success
