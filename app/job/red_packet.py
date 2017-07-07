from .daka import Daka


class RedPacket(Daka):
    job_name = '京东小金库现金红包'

    index_url = 'https://m.jr.jd.com/udc-active/2017/618RedPacket/html/index.html'
    sign_url = 'https://ms.jr.jd.com/gw/generic/activity/h5/m/receiveZhiBoXjkRedPacket'
    test_url = 'https://home.m.jd.com'

    def is_signed(self):
        # 这个任务在领取前不能知道今天是否领取过, 因此返回 None 以便任务能够执行.
        return None

    def sign(self):
        # 参见 red_packet_index.js

        payload = {
            'reqData': '{"activityCode":"ying_yong_bao_618"}',
            'sid': self.session.cookies.get('sid')
        }

        response = self.session.post(self.sign_url, data=payload).json()

        if response['resultCode'] == 0:
            sign_success = response['resultData']['success']

            if sign_success:
                self.logger.info('领取成功, 获得 {} 元.'.format(response['resultData']['data']))

            else:
                message = response['resultData'].get('msg') or response.get('resultMsg')
                self.logger.info('领取结果: {}'.format(message))

                if response['resultData'].get('code') == '03':
                    # 当 code 为 03 时, 表示今天已领过了, 因为领取前无法知道是否领过, 此处也当做任务成功返回
                    sign_success = True

            return sign_success

        else:
            message = response.get('resultMsg')
            self.logger.error('领取失败: {}'.format(message))
            return False
