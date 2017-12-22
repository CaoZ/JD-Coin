#!/usr/bin/env python3
# encoding: utf-8
# author: Vincent
# refer: https://github.com/vc5

from .daka import Daka


class DoubleSign_JR(Daka):
    '''
    京东金融客户端双签
    '''

    job_name = '京东金融客户端双签'

    index_url = 'https://m.jr.jd.com/activity/brief/doubleSignature/index.html'
    info_url = 'https://ms.jr.jd.com/newjrmactivity/base/sign1111/init.action'
    sign_url = 'https://ms.jr.jd.com/newjrmactivity/base/sign1111/getSignAward.action'
    # test_url = 'https://home.m.jd.com'
    # poker_url = 'https://api.m.jd.com/client.action?functionId=getCardResult'

    def is_signed(self):
        r = self.session.get(self.index_url)
        self.sid = self.session.cookies.get('sid')
        params = {'sid':self.sid}
        r1 = self.session.get(self.info_url,params=params)
        result = r1.json()
        if result['isGet']:
            self.logger.info('双签已经进行')
        return result['isGet']

    def sign(self):
        r = self.session.get(self.sign_url,params={'sid':self.sid})
        as_json = r.json()
        isSucces = not as_json['status'] #status 0 签到成功，1金融未签到
        if isSucces:
            self.logger.info('双签成功')
        return isSucces


