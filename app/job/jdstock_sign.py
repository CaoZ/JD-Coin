#!/usr/bin/env python
# encoding: utf-8
# author: Vincent
# refer: https://github.com/vc5

import json
import re
import time

from .daka import Daka


class JDStock_Sign(Daka):
    job_name = '京东股票翻牌'
    index_url = 'https://active.jd.com/forever/stockSign/html/index.html'
    sign_url = 'https://gpm.jd.com/signin/choice'
    home_url = 'https://gpm.jd.com/signin/home'

    def is_signed(self):
        self.session.headers.update({'Referer': 'https://active.jd.com/forever/stockSign/html/index.html'})

        return False

    def sign(self):
        isSucces = False
        timestamp = str(int(time.time() * 1000))
        self.sid = self.session.cookies.get('sid')
        p = {'sid': self.sid,
             '_': timestamp,
             'position': 1,
             'callback': 'Zepto1514220029216'
             }
        r = self.session.get(self.sign_url, params=p)
        res = re.findall(r'\[.*?\]', r.text)[0]
        j = json.loads(res)
        isSucces = j[0]['success']
        return isSucces
