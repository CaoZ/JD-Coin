import traceback

from app import chrome as browser
# import browser

from .common import find_value, RequestError


class Daka:
    job_name = '小白卡钢镚打卡'

    index_url = 'https://bk.jd.com/m/channel/login/daka.html'
    login_url = 'https://home.m.jd.com'
    sign_url = 'https://bk.jd.com/m/channel/login/clock.html'
    test_url = index_url
    job_gb_url = 'https://bk.jd.com/m/channel/login/recDakaGb.html'
    is_mobile = True

    def __init__(self, bot):
        self.bot = bot
        self.session = bot.session
        self.job_success = False
        self.logger = bot.config.logger

    def run(self):
        self.logger.info('Job Start: {}'.format(self.job_name))

        is_login = self.is_login()
        self.logger.info('登录状态: {}'.format(is_login))

        if not is_login:
            self.logger.info('进行登录...')
            try:
                self.login()
                is_login = True
                self.logger.info('登录成功')
            except Exception as e:
                self.logger.error('登录失败: {}'.format(repr(e)))

        if is_login:
            if self.is_signed():
                self.job_success = True
            else:
                self.job_success = self.sign()

        self.logger.info('Job End.')

    def is_login(self):
        r = self.session.get(self.test_url, allow_redirects=False)

        if r.is_redirect and 'passport' in r.headers['Location']:
            return False
        else:
            return True

    def login(self):
        cookies = browser.get_cookies(url=self.login_url, signbot=self.bot)
        self.session.cookies.update(cookies)

    def is_signed(self):
        r = self.session.get(self.index_url)
        signed = False

        if r.ok:
            sign_pattern = r'dakaed:\s*(\w+)'
            days_pattern = r'dakaNumber:\s*(\d+)'

            try:
                signed = ('true' == find_value(sign_pattern, r.text))
                sign_days = int(find_value(days_pattern, r.text))
                self.logger.info('今日已打卡: {}; 打卡天数: {}'.format(signed, sign_days))

            except Exception as e:
                self.logger.error('返回数据结构可能有变化, 获取打卡数据失败: {}'.format(e))
                traceback.print_exc()

        return signed

    def sign(self):
        try:
            data = self.fetch_data(self.sign_url)
            self.logger.info('打卡成功: ' + data['resultMessage'])
            return True

        except RequestError as e:
            if e.code == '0003':
                # 已打卡 7 次, 需要先去 "任务" 里完成一个领钢镚任务...
                self.logger.info('已打卡 7 次, 去完成领钢镚任务...')
                pick_success = self.pick_gb()

                if pick_success:
                    # 钢镚领取成功, 重新开始打卡任务
                    return self.sign()
                else:
                    e.message = '钢镚领取任务未成功完成.'

            self.logger.error('打卡失败: ' + e.message)
            return False

    def pick_gb(self):
        # 任务列表在 https://bk.jd.com/m/money/doJobMoney.html 中看
        # 领钢镚的任务的 id 是 82
        try:
            data = self.fetch_data(self.job_gb_url)
            self.logger.info('钢镚领取成功: {}'.format(data['resultMessage']))
            return True

        except RequestError as e:
            self.logger.error('领钢镚 -> 钢镚领取失败: {}'.format(e.message))
            return False

    def fetch_data(self, url, payload=None):
        r = self.session.get(url, params=payload)

        try:
            as_json = r.json()
        except ValueError:
            raise RequestError('unexpected response: url: {}; http code: {}'.format(url, r.status_code), response=r)

        if as_json['success']:
            # 请求成功
            return as_json

        else:
            error_msg = as_json.get('resultMessage') or str(as_json)
            error_code = as_json.get('resultCode')
            raise RequestError(error_msg, error_code)
