#!/usr/bin/env python
# encoding: utf-8
import logging
import os
import pickle
import traceback
from pathlib import Path

import requests
from app.config import config_dict, get_users
from app.job import jobs_all


class SignBot:

    def __init__(self, jd_user):
        self.config = jd_user
        self.session = self.make_session(jd_user)

    def get_config(self, config):
        pass

    def update_config(self):
        pass

    def sign(self):
        jobs = [job for job in jobs_all if job.__name__ not in self.config.jobs_skip]
        jobs_failed = []

        for job_class in jobs:
            job = job_class(self)

            # 默认使用移动设备User-agent,否则使用PC版User-Agent
            if not job.is_mobile:
                job.session.headers.update({
                    'User-Agent': self.config.ua_pc})

            try:
                job.run()
            except Exception as e:
                logging.error('# 任务运行出错: ' + repr(e))
                traceback.print_exc()

            if not job.job_success:
                jobs_failed.append(job.job_name)

        print('=================================')
        print('= 任务数: {}; 失败数: {}'.format(len(jobs), len(jobs_failed)))

        if jobs_failed:
            print('= 失败的任务: {}'.format(jobs_failed))
        else:
            print('= 全部成功 ~')

        print('=================================')

        self.save_session(self.session)

    def make_session(self, config) -> requests.Session:
        session = requests.Session()

        session.headers.update({
            'User-Agent': config.ua
        })

        data_file = Path(__file__).parent.joinpath('../data/' + config.cookiesname)

        if data_file.exists():
            try:
                bytes = data_file.read_bytes()
                cookies = pickle.loads(bytes)
                session.cookies = cookies
                logging.info('# 从文件加载 %s 成功.', config.cookiesname)
            except Exception as e:
                logging.info('# 未能成功载入 %s, 从头开始~', config.cookiesname)

        return session

    def save_session(self, session):
        data = pickle.dumps(session.cookies)

        data_dir = Path(__file__).parent.joinpath('../data/')
        data_dir.mkdir(exist_ok=True)
        data_file = data_dir.joinpath(self.config.cookiesname)
        data_file.write_bytes(data)


def main(config):
    if config_dict['debug'] and os.getenv('HTTPS_PROXY'):
        proxy_patch()
    jd_users = get_users(config_dict)
    for jd_user in jd_users:
        bot = SignBot(jd_user)
        bot.sign()











def proxy_patch():
    """
    Requests 似乎不能使用系统的证书系统, 方便起见, 不验证 HTTPS 证书, 便于使用代理工具进行网络调试...
    http://docs.python-requests.org/en/master/user/advanced/#ca-certificates
    """
    import warnings
    from requests.packages.urllib3.exceptions import InsecureRequestWarning

    class XSession(requests.Session):
        def __init__(self):
            super().__init__()
            self.verify = False

    requests.Session = XSession
    warnings.simplefilter('ignore', InsecureRequestWarning)


if __name__ == '__main__':
    main(config_dict)
