import traceback
import time

from pyquery import PyQuery

from .common import RequestError
from .daka import Daka


class DoubleSign(Daka):
    job_name = '双签赢奖励'

    index_url = 'https://ms.jr.jd.com/gw/generic/jrm/h5/m/getAwardList?_=' + \
        str((int)(time.time()))
    sign_url = 'https://ms.jr.jd.com/gw/generic/jrm/h5/m/getSignAwardJR?_=' +\
        str((int)(time.time()))
    test_url = index_url

    def sign(self):
        sign_success = True
        message = ''
        if(self.is_signed() == False):
            try:
                res = self.do_sign()
            except RequestError as e:
                self.logger.error('双签失败: {}'.format(e.message))
                return False

            if res['resultCode'] == 200:
                award_data = res.get('awardList')

                if not award_data:
                    message = '运气不佳，领到一个空空的礼包'

                else:
                    award = award_data[0]
                    sign_success = True
                    message = '领到 {} 个{}'.format(
                        award['count'], award['name'])
        else:
            sign_success = False
            message = '完成双签才可领取礼包'

        self.logger.info('双签成功: {}; Message: {}'.format(sign_success, message))

        return sign_success

    def is_signed(self):
        sign = False
        r = self.session.post(self.index_url)
        as_json = r.json()
        if 'resultData' in as_json and 'awardList' in as_json['resultData']:
            award_data = as_json['resultData'].get('awardList')
            sign = True
            self.logger.info('今日已签到: {}; 双签奖励: {}'.format(
                sign, award_data[0]['count']))
            return sign
        return False

    def do_sign(self):
        r = self.session.post(self.sign_url)

        try:
            as_json = r.json()
            # {'resultCode': 0, 'resultMsg': '操作成功',
            #  'resultData': {'resultCode': 200, '
            #                   resultMsg': '响应成功',
            #                   'status': 0, 'awardList': [
            #                                       {'count': 5, 'name': '京豆', 'type': 1}]},
            #                                        'channelEncrypt': 0}
        except ValueError:
            raise RequestError('unexpected response: url: {}; http code: {}'.format(
                self.sign_url, r.status_code), response=r)

        if 'resultData' in as_json and 'resultCode' in as_json['resultData']:
            # 请求成功
            return as_json['resultData']

        else:
            error_msg = as_json.get('message') or str(as_json)
            error_code = as_json.get('businessCode') or as_json.get('code')
            raise RequestError(error_msg, error_code)
