#!/usr/bin/env python
# encoding: utf-8
import logging
import os
import pickle
import traceback
from pathlib import Path

import requests
from config import config
from job import jobs_all


def main():
    session = make_session()

    jobs = [job for job in jobs_all if job.__name__ not in config.jobs_skip]
    jobs_failed = []

    for job_class in jobs:
        job = job_class(session)

        # 默认使用移动设备User-agent,否则使用PC版User-Agent
        if not job.is_mobile:
            job.session.headers.update({
                'User-Agent': config.ua_pc})

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

    save_session(session)


def make_session() -> requests.Session:
    session = requests.Session()

    session.headers.update({
        'User-Agent': config.ua
    })

    data_file = Path(__file__).parent.joinpath('../data/cookies')

    if data_file.exists():
        try:
            bytes = data_file.read_bytes()
            cookies = pickle.loads(bytes)
            session.cookies = cookies
            logging.info('# 从文件加载 cookies 成功.')
        except Exception as e:
            logging.info('# 未能成功载入 cookies, 从头开始~')

    return session


def save_session(session):
    data = pickle.dumps(session.cookies)

    data_dir = Path(__file__).parent.joinpath('../data/')
    data_dir.mkdir(exist_ok=True)
    data_file = data_dir.joinpath('cookies')
    data_file.write_bytes(data)


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
    if config.debug and os.getenv('HTTPS_PROXY'):
        proxy_patch()

    main()
