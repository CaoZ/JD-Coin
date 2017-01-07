import util
from .daka import Daka


class Bean(Daka):
    job_name = '京东会员页签到领京豆'

    index_url = 'https://vip.jd.com'
    info_url = 'https://vip.jd.com/member/getUserInfo.html'
    login_url = 'https://qq.jd.com/new/qq/login.aspx'
    sign_url = 'https://vip.jd.com/common/signin.html'
    test_url = 'http://vip.jd.com/member/myJingBean/index.html'

    def login_data(self):
        return {'ReturnUrl': self.test_url}

    def is_signed(self):
        response = self.session.get(self.info_url).json()
        signed = False

        if response['success']:
            user_info = response['result']['userInfo']
            beans_count = user_info['userJingBeanNum']

            ext_user_info = response['result']['extUserInfo']
            signed = (ext_user_info['isSignIn'] == 'true')

            print('# 今日已签到: {}; 现在有 {} 个京豆.'.format(signed, beans_count))

        else:
            message = response['resultTips']
            print('# 获取京豆信息失败: {}'.format(message))

        return signed

    def sign(self):
        token = self._get_token()
        payload = {'token': token}

        response = self.session.get(self.sign_url, params=payload).json()

        if response['success']:
            # 签到成功, 获得若干个京豆
            beans_get = response['result']['jdnum']
            print('# 签到成功, 获得 {} 个京豆.'.format(beans_get))
            return True

        else:
            # 例如: 您已签到过，请勿重复签到！
            message = response['resultTips']
            print('# 签到失败: {}'.format(message))
            return False

    def _get_token(self):
        html = self.session.get(self.index_url).text
        pattern = r'pageConfig.token="(\d+)"'
        token = util.find_value(pattern, html)

        if not token:
            raise Exception('token 未找到.')

        return token
