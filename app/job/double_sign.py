import traceback

from pyquery import PyQuery

from .common import RequestError
from .daka import Daka


class DoubleSign(Daka):
    job_name = '双签赢奖励'

    index_url = 'https://ljd.m.jd.com/countersign/index.action'
    sign_url = 'https://ljd.m.jd.com/countersign/receiveAward.json'
    test_url = index_url

    def is_signed(self):
        signed = False

        try:
            signed = PyQuery(self.page_data())('#awardFlag').val() == '2'
            self.logger.info('今日已双签: {}'.format(signed))

        except Exception as e:
            self.logger.error('返回数据结构可能有变化, 获取双签数据失败: {}'.format(e))
            traceback.print_exc()

        return signed

    def sign(self):
        # 参见 https://ljd.m.jd.com/js/countersign/countersign.js

        sign_success = True
        message = ''

        document = PyQuery(self.page_data())

        jd_signed = document('#jdHasSign').val() == 'true'
        jr_signed = document('#jrHasSign').val() == 'true'

        if not (jd_signed and jr_signed):
            sign_success = False
            message = '完成双签才可领取礼包'

        else:
            try:
                res = self.do_sign()
            except RequestError as e:
                self.logger.error('双签失败: {}'.format(e.message))
                return False

            if res['code'] == '0':
                award_data = res.get('data')

                if not award_data:
                    message = '运气不佳，领到一个空空的礼包'

                else:
                    award = award_data[0]
                    sign_success = True
                    message = '领到 {} 个{}'.format(award['awardCount'], award['awardName'])

            else:
                # 活动不定时开启，将活动时间未开始/已结束等情况都视作签到成功

                if res['code'] == 'DS102':
                    message = '来早了，活动还未开始'
                elif res['code'] == 'DS103':
                    message = '来晚了，活动已经结束了'
                elif res['code'] == 'DS104':
                    message = '运气不佳，领到一个空空的礼包'
                elif res['code'] == 'DS106':
                    sign_success = False
                    message = '完成双签才可领取礼包'
                else:
                    sign_success = False
                    message = '未知错误，Code={}'.format(res['code'])

        self.logger.info('双签成功: {}; Message: {}'.format(sign_success, message))

        return sign_success

    def do_sign(self):
        r = self.session.post(self.sign_url)

        try:
            as_json = r.json()
        except ValueError:
            raise RequestError('unexpected response: url: {}; http code: {}'.format(self.sign_url, r.status_code), response=r)

        if 'res' in as_json and 'code' in as_json['res']:
            # 请求成功
            return as_json['res']

        else:
            error_msg = as_json.get('message') or str(as_json)
            error_code = as_json.get('businessCode') or as_json.get('code')
            raise RequestError(error_msg, error_code)

    def page_data(self):
        if not hasattr(self, '_page_data'):
            self._page_data = self.session.get(self.index_url).text

        return self._page_data
