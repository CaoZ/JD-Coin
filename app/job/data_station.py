from .daka import Daka


class DataStation(Daka):
    """
    流量加油站
    """
    job_name = '流量加油站签到领流量'

    index_url = 'https://fbank.m.jd.com'
    info_url = 'https://fbank.m.jd.com/api.json?functionId=getFbankIndex'
    sign_url = 'https://fbank.m.jd.com/api.json?functionId=fBankSign'
    test_url = 'https://home.m.jd.com'

    def is_signed(self):
        response = self.session.get(self.info_url).json()
        signed = False

        if response['success']:
            sign_info = response['signInfo']
            signed = (sign_info['signCode'] != '0')
            message = sign_info['message']

            self.logger.info('今日已签到: {}; Message: {}.'.format(signed, message))

        else:
            message = response.get('message') or response.get('errorMessage')
            self.logger.error('签到信息获取失败: {}'.format(message))

        return signed

    def sign(self):
        response = self.session.get(self.sign_url).json()

        if response['success']:
            sign_success = ('errorCode' not in response)
            message = response.get('errorMessage') or response.get('message')
            self.logger.info('签到成功: {}; Message: {}.'.format(sign_success, message))
            return sign_success

        else:
            message = response.get('message') or response.get('errorMessage')
            self.logger.error('签到失败: {}'.format(message))
            return False
