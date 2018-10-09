from .bean import Bean


class SignJR(Bean):
    job_name = '京东金融签到领奖励'

    index_url = 'https://vip.jr.jd.com'
    info_url = 'https://vip.jr.jd.com/newSign/querySignRecord'
    sign_url = 'https://vip.jr.jd.com/newSign/doSign'
    test_url = 'https://vip.jr.jd.com/coupon/myIntegralDetail'

    def is_signed(self):
        r = self.session.post(self.info_url)
        signed = False

        if r.ok:
            data = r.json()
            signed = data['isFlag']
            sign_days = data['signContinuity']
            self.logger.info('今日已签到: {}; 签到天数: {}; 现有钢镚: {}'.format(signed, sign_days, data['accountBalance']))

        return signed

    def sign(self):
        headers = {'Referer': self.index_url}
        response = self.session.post(self.sign_url, headers=headers).json()

        sign_success = response['signSuccess']
        sign_data = response['signResData']

        if sign_success and sign_data:
            unit = ['', '京豆', '金币', '钢镚'][sign_data['rewardType']]
            count = sign_data['thisAmount'] / 100 if sign_data['rewardType'] == 3 else sign_data['thisAmount']
            self.logger.info('签到成功, 获得 {} 个{}.'.format(count, unit))

        else:
            self.logger.error('签到失败: Code={}'.format(response['resBusiCode']))

        return sign_success
