import traceback

import browser
import job
import util


class Daka:
    job_name = '小白卡钢镚打卡'

    index_url = 'https://bk.jd.com/m/channel/login/daka.html'
    login_url = index_url
    sign_url = 'https://bk.jd.com/m/channel/login/clock.html'
    test_url = index_url
    job_gb_url = 'https://bk.jd.com/m/channel/login/recDakaGb.html'
    logger = job.logger

    def __init__(self, session):
        self.session = session
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
        cookies = browser.get_cookies(self.login_url)
        self.session.cookies.update(cookies)

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
