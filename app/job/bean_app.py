from .common import RequestError
from .daka import Daka


class BeanApp(Daka):
    """
    京东客户端签到领京豆. 由于是 App (Mobile) 端页面, 登录方式与领钢镚的相同, 不同于电脑端领京豆.
    """
    job_name = '京东客户端签到领京豆'

    index_url = 'https://bean.m.jd.com'
    info_url = 'https://api.m.jd.com/client.action?functionId=findBeanIndex'
    sign_url = 'https://api.m.jd.com/client.action?functionId=signBeanIndex'
    test_url = 'https://home.m.jd.com'

    client_info = {
        'client': 'ld',
        'clientVersion': '1.0.0'
    }

    def is_signed(self):
        try:
            data = self.fetch_data(self.info_url)
        except RequestError as e:
            self.logger.error('签到信息获取失败: {}'.format(e.message))
            return False

        # 根据测试, 1 表示已签到, 2 表示未签到, 3 表示未登录
        signed = (data['status'] == '1')
        sign_days = int(data['continuousDays'])
        beans_count = int(data['totalUserBean'])

        self.logger.info('今日已签到: {}; 签到天数: {}; 现有京豆: {}'.format(signed, sign_days, beans_count))
        return signed

    def sign(self):
        try:
            data = self.fetch_data(self.sign_url)
        except RequestError as e:
            self.logger.error('签到失败: {}'.format(e.message))
            return False

        sign_success = (data['status'] == '1')

        if sign_success:
            bean_count = data['dailyAward']['beanAward']['beanCount']
            message = '获得京豆 {} 个.'.format(bean_count)
        else:
            message = data['dailyAward']['title']

        self.logger.info('签到成功: {}; Message: {}'.format(sign_success, message))

        return sign_success

    def fetch_data(self, url, payload=None):
        payload = {**payload, **self.client_info} if payload else self.client_info

        r = self.session.get(url, params=payload)

        try:
            as_json = r.json()
        except ValueError:
            raise RequestError('unexpected response: url: {}; http code: {}'.format(url, r.status_code), response=r)

        if as_json['code'] != '0' or 'errorCode' in as_json or 'errorMessage' in as_json:
            error_msg = as_json.get('echo') or as_json.get('errorMessage') or str(as_json)
            error_code = as_json.get('errorCode') or as_json.get('code')
            raise RequestError(error_msg, code=error_code, response=r)

        # 请求成功
        return as_json['data']
