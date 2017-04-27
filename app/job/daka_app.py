import traceback

from .daka import Daka


class DakaApp(Daka):
    job_name = '京东客户端钢镚打卡'

    index_url = 'https://m.jr.jd.com/spe/qyy/main/index.html?userType=41'
    sign_url = 'https://ms.jr.jd.com/gw/generic/base/h5/m/baseSignInEncrypt'
    test_url = 'https://ms.jr.jd.com/gw/generic/base/h5/m/baseGetMessByGroupType'

    def __init__(self, session):
        super().__init__(session)
        self.sign_data = {}

    def get_sign_data(self):
        payload = {
            'reqData': '{"clientType":"outH5","userType":41,"groupType":154}',
            'sid': self.session.cookies.get('sid'),
            'source': 'jrm'
        }

        sign_data = {}

        try:
            # 参见 daka_app_min.js -> h.getSign, 第 1825 行开始
            r = self.session.post(self.test_url, data=payload)
            as_json = r.json()

            if 'resultData' in as_json:
                sign_data = r.json()['resultData']['53']

            else:
                error_msg = as_json.get('resultMsg') or as_json.get('resultMessage')
                self.logger.error('获取打卡数据失败: {}'.format(error_msg))

        except Exception as e:
            self.logger.error('获取打卡数据失败: {}'.format(e))

        return sign_data

    def is_login(self):
        sign_data = self.get_sign_data()

        # 参见 daka_app_min.js, 第 1835 行
        is_login = 'suitable' in sign_data

        if is_login:
            # 用户已登录, sign_data 有效, 存储下
            self.sign_data = sign_data

        return is_login

    def is_signed(self):
        sign_data = self.sign_data or self.get_sign_data()

        signed = False

        try:
            signed = sign_data['signInStatus'] == 1
            self.logger.info('今日已打卡: {}'.format(signed))

        except Exception as e:
            self.logger.error('返回数据结构可能有变化, 获取打卡数据失败: {}'.format(e))
            traceback.print_exc()

        return signed

    def sign(self):
        payload = {
            'reqData': '{}',
            'sid': self.session.cookies.get('sid'),
            'source': 'jrm'
        }

        r = self.session.post(self.sign_url, data=payload)
        as_json = r.json()

        if 'resultData' in as_json:
            result_data = as_json['resultData']
            sign_success = result_data['isSuccess']
            message = result_data['showMsg']

            # 参见 daka_app_min.js, 第 1893 行
            continuity_days = result_data['continuityDays']

            if continuity_days > 1:
                message += '; 签到天数: {}'.format(continuity_days)

        else:
            sign_success = False
            message = as_json.get('resultMsg') or as_json.get('resultMessage')

        self.logger.info('打卡成功: {}; Message: {}'.format(sign_success, message))

        return sign_success
