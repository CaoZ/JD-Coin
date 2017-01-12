import requests

from config import config
from job import jobs_all


def main():
    session = requests.Session()

    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:50.0) Gecko/20100101 Firefox/50.0'
    })

    failed_jobs = []

    for job_class in jobs_all:
        job = job_class(session)
        job.run()

        if not job.job_success:
            failed_jobs.append(job.job_name)

        print()

    print('=================================')
    print('= 任务数: {}; 失败数: {}'.format(len(jobs_all), len(failed_jobs)))

    if len(failed_jobs) > 0:
        print('= 失败的任务: {}'.format(failed_jobs))
    else:
        print('= 全部成功 ~')

    print('=================================')


def debug_patch():
    """
    不验证 HTTPS 证书, 便于使用代理工具进行网络调试...
    """
    from requests import Session

    class XSession(Session):
        def __init__(self):
            super().__init__()
            self.verify = False

    requests.Session = XSession


if __name__ == '__main__':
    if config.debug:
        debug_patch()

    main()
