from .bean import Bean


class BeanJR(Bean):
    job_name = '京东金融签到领京豆'

    index_url = 'https://vip.jr.jd.com'
    info_url = 'https://vip.jr.jd.com/newSign/querySignRecord'
    sign_url = 'https://vip.jr.jd.com/newSign/doSign'
    test_url = 'https://vip.jr.jd.com/coupon/myIntegralDetail'

    def is_signed(self):
        r = self.session.post(self.info_url)
        signed = False

        if r.ok:
            data = r.json()
            signed = data['isSign']
            sign_days = data['signNum']
            print('# 今天已签到: {}; 签到天数: {}'.format(signed, sign_days))

        return signed

    def sign(self):
        headers = {'Referer': self.index_url}
        response = self.session.post(self.sign_url, headers=headers).json()
        message = response['message']
        sign_success = False

        if response['success']:
            sign_result = response['sign']
            sign_success = sign_result['result']

            if sign_success:
                count = sign_result['num']
                print('# 签到成功, 获得 {} 个京豆.'.format(count))
            else:
                print('# 签到未成功: {}'.format(message))

        else:
            print('# 签到失败: {}'.format(message))

        return sign_success
