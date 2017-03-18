import time
import traceback
from urllib.parse import urlparse, parse_qs

from qqlib import LogInError, NeedVerifyCode

import job
import util
from config import config
from qq import JDQQ


class Daka:
    job_name = '小白卡钢镚打卡'

    index_url = 'https://bk.jd.com/m/channel/login/daka.html'
    login_url = 'https://plogin.m.jd.com/cgi-bin/m/qqlogin'
    sign_url = 'https://bk.jd.com/m/channel/login/clock.html'
    test_url = index_url
    job_gb_url = 'https://bk.jd.com/m/channel/login/recDakaGb.html'
    logger = job.logger

    def __init__(self, session):
        self.session = session
        self.client_id = ''
        self.redirect_uri = ''
        self.job_success = False

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
            except LogInError as e:
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

    def login_data(self):
        """
        在登录时需要附加的数据 (方便其他类继承...)
        """
        return {'appid': 100, 'returnurl': self.test_url}

    def login(self):
        r = self.session.get(self.login_url, params=self.login_data())
        # 请求后, 会进行两次跳转, 最终会跳转到 "QQ帐号安全登录" 页面
        # https://graph.qq.com/oauth/show?which=Login&display=pc&response_type=code&client_id=100273020&redirect_uri=https%3A%2F%2Fplogin.m.jd.com%2Fcgi-bin%2Fm%2Fqqcallback%3Fsid%3Dq8m7xgogbro69ucqegmearcmofs8zbcq&state=sp6r8u0z
        params = parse_qs(urlparse(r.url).query)

        state = ''

        try:
            self.client_id = params['client_id'][0]
            self.redirect_uri = params['redirect_uri'][0]

            if 'state' in params:
                # state 可能不存在, 比如在登录 web 版京东时
                state = params['state'][0]

        except Exception as e:
            raise Exception('缺少 client_id、redirect_uri 或 state 参数：' + str(e))

        g_tk = self.login_qq()
        self.login_jd(state, g_tk)

    def login_qq(self):
        """
        使用帐号密码进行登录
        """
        qq = JDQQ(config.qq['account'], config.qq['password'], self.session)

        while True:
            try:
                qq.login()
                break

            except NeedVerifyCode as e:
                verifier = e.verifier
                util.show_image(verifier.fetch_image())
                verify_code = input('请输入验证码: ')

                try:
                    verifier.verify(verify_code)
                except NeedVerifyCode:
                    # 需刷新验证码, 使用新的 verifier; 或 qq.login(force=True)
                    qq.verifier = None
                    print('验证码错误.')

            except LogInError as e:
                raise LogInError('登录 QQ 失败: {}'.format(e))

        return qq.g_tk()

    def login_jd(self, state, g_tk):
        """
        使用第三方登录系统(QQ)登录京东
        """
        data = {
            'response_type': 'code',
            'client_id': self.client_id,
            'redirect_uri': self.redirect_uri,
            'state': state,
            'src': '1',
            'g_tk': g_tk,
            'auth_time': int(time.time())
        }

        r = self.session.post('https://graph.qq.com/oauth2.0/authorize', data=data)
        last_location = urlparse(r.url)

        if 'jd.com' not in last_location.netloc:
            self.logger.error('通过 QQ 登录京东失败.')
            self.logger.error('Last page url: ' + r.url)
            self.logger.error('Last page content: \n' + r.text)
            raise Exception('通过 QQ 登录京东失败.')

        self.logger.info('通过 QQ 登录京东成功.')
        return True

    def is_signed(self):
        r = self.session.get(self.index_url)
        signed = False

        if r.ok:
            sign_pattern = r'dakaed:\s*(\w+)'
            days_pattern = r'dakaNumber:\s*(\d+)'

            try:
                signed = ('true' == util.find_value(sign_pattern, r.text))
                sign_days = int(util.find_value(days_pattern, r.text))
                self.logger.info('今日已打卡: {}; 打卡天数: {}'.format(signed, sign_days))

            except Exception as e:
                self.logger.error('返回数据结构可能有变化, 获取打卡数据失败: {}'.format(e))
                traceback.print_exc()

        return signed

    def sign(self):
        r = self.session.get(self.sign_url)
        sign_success = False

        if r.ok:
            as_json = r.json()
            sign_success = as_json['success']
            message = as_json['resultMessage']

            if not sign_success and as_json['resultCode'] == '0003':
                # 已打卡 7 次, 需要先去 "任务" 里完成领一个钢镚的任务...
                self.logger.info('已打卡 7 次, 去完成领钢镚任务...')
                pick_success = self.pick_gb()

                if pick_success:
                    # 钢镚领取成功, 重新开始打卡任务
                    return self.sign()

                else:
                    message = '钢镚领取任务未成功完成.'

            self.logger.info('打卡成功: {}; Message: {}'.format(sign_success, message))

        else:
            self.logger.error('打卡失败: Status code: {}; Reason: {}'.format(r.status_code, r.reason))

        return sign_success

    def pick_gb(self):
        # 任务列表在 https://bk.jd.com/m/money/doJobMoney.html 中看
        # 领钢镚的任务的 id 是 82
        r = self.session.get(self.job_gb_url)
        pick_success = False

        try:
            as_json = r.json()
            pick_success = as_json['success']
            message = as_json['resultMessage']
            self.logger.info('钢镚领取成功: {}; Message: {}'.format(pick_success, message))

        except Exception as e:
            self.logger.error('领钢镚 -> 钢镚领取失败: {}'.format(e))
            traceback.print_exc()

        return pick_success
