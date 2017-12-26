import argparse
import json
import logging
import sys
from base64 import b85decode
from pathlib import Path

# log_format = '%(asctime)s %(name)s[%(module)s] %(levelname)s: %(message)s'
log_format = '%(asctime)s %(name)s %(levelname)s: %(message)s'
logging.basicConfig(format=log_format, level=logging.INFO)


class Config:
    def __init__(self):
        self.debug = False
        self.log_format = log_format
        self.ua_pc = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/62.0.3202.94 Chrome/62.0.3202.94 Safari/537.36'
        self.ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Version/11.0 Mobile/15C114 Safari/604.1'
        self.jd = {
            'username': '',
            'password': ''
        }

        self.jobs_skip = []
        self.headless = False

    @classmethod
    def load(cls, d):
        the_config = Config()

        the_config.debug = d.get('debug', False)
        the_config.headless = d.get('headless', False)

        try:
            the_config.jd = {
                'username': b85decode(d['jd']['username']).decode(),
                'password': b85decode(d['jd']['password']).decode()
            }
        except Exception as e:
            logging.error('获取京东帐号出错: ' + repr(e))

        if not (the_config.jd['username'] and the_config.jd['password']):
            # 有些页面操作还是有用的, 比如移动焦点到输入框... 滚动页面到登录表单位置等
            # 所以不禁止 browser 的 auto_login 动作了, 但两项都有才自动提交, 否则只进行自动填充动作
            the_config.jd['auto_submit'] = 0  # used in js
            logging.info('用户名/密码未找到, 自动登录功能将不可用.')

        else:
            the_config.jd['auto_submit'] = 1

        the_config.jobs_skip = d.get('jobs_skip', [])

        return the_config


def load_config():
    parser = argparse.ArgumentParser()
    parser.add_argument('-c', '--config', help='config file name')
    args = parser.parse_args()

    config_name = args.config or 'config.json'
    logging.info('使用配置文件 "{}".'.format(config_name))

    config_file = Path(__file__).parent.joinpath('../conf/', config_name)

    if not config_file.exists():
        config_name = 'config.default.json'
        logging.warning('配置文件不存在, 使用默认配置文件 "{}".'.format(config_name))
        config_file = config_file.parent.joinpath(config_name)

    try:
        # 略坑, Path.resolve() 在 3.5 和 3.6 上表现不一致... 若文件不存在 3.5 直接抛异常, 而 3.6
        # 只有 Path.resolve(strict=True) 才抛, 但 strict 默认为 False.
        # 感觉 3.6 的更合理些...
        config_file = config_file.resolve()
        config_dict = json.loads(config_file.read_text())
    except Exception as e:
        sys.exit('# 错误: 配置文件载入失败: {}'.format(e))

    the_config = Config.load(config_dict)

    return the_config


config = load_config()
