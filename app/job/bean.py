from pyquery import PyQuery
from requests import HTTPError, ReadTimeout

from .daka import Daka


class Bean(Daka):
    job_name = '京东会员页签到领京豆'

    index_url = 'https://vip.jd.com/home.html'
    info_url = 'https://vip.jd.com/member/getUserInfo.html'
    sign_url = 'https://vip.jd.com/sign/index'
    test_url = 'https://vip.jd.com/member/myJingBean/index.html'
    login_url = test_url

    def __init__(self, session):
        super().__init__(session)
        self.page_data = ''

    def is_signed(self):
        page_data = self._get_page_data()
        signed = '已签到' in PyQuery(page_data)('.sign-in').text()

        detail = self.session.get(self.info_url).json()

        if detail['success']:
            user_info = detail['result']['userInfo']
            beans_count = user_info['userJingBeanNum']
            self.logger.info('今日已签到: {}; 现在有 {} 个京豆.'.format(signed, beans_count))

        else:
            self.logger.info('今日已签到: {}'.format(signed))

        return signed

    def sign(self):
        try:
            r = self.session.get(self.sign_url, timeout=10)
            r.raise_for_status()

            sign_message = PyQuery(r.text)('.day-info.active .title').text()
            self.logger.info(sign_message)
            return True  # 似乎没有签到失败的情况，暂且认为签到成功

        except (HTTPError, ReadTimeout) as e:
            self.logger.error('签到失败: {}'.format(e))
            return False

    def _get_page_data(self):
        if not self.page_data:
            self.page_data = self.session.get(self.index_url).text

        return self.page_data
