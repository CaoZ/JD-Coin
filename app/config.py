import argparse
import json
import logging
import sys
from base64 import b85decode
from pathlib import Path

log_format = '%(asctime)s %(name)s[%(module)s] %(levelname)s: %(message)s'
logging.basicConfig(format=log_format, level=logging.INFO)


class Config:
    def __init__(self):
        self.debug = False
        self.log_format = log_format
        self.ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:51.0) Gecko/20100101 Firefox/51.0'

        self.jd = {
            'username': '',
            'password': ''
        }

    @classmethod
    def load(cls, d):
        the_config = Config()

        the_config.debug = d.get('debug', False)

        try:
            the_config.jd = {
                'username': b85decode(d['jd']['username']).decode(),
                'password': b85decode(d['jd']['password']).decode()
            }
        except Exception as e:
            raise Exception('获取京东帐号出错: ' + repr(e))

        return the_config


def load_config():
    parser = argparse.ArgumentParser()
    parser.add_argument('-c', '--config', help='config file name')
    args = parser.parse_args()

    config_name = args.config or 'config.json'
    logging.info('使用配置文件 "{}".'.format(config_name))

    try:
        # 略坑, Path.resolve() 在 3.5 和 3.6 上表现不一致... 若文件不存在 3.5 直接抛异常, 而 3.6
        # 只有 Path.resolve(strict=True) 才抛, 但 strict 默认为 False.
        # 感觉 3.6 的更合理些...
        config_file = Path(__file__).parent.joinpath('../conf/', config_name).resolve()
        config_dict = json.loads(config_file.read_text())
    except FileNotFoundError:
        sys.exit('# 错误: 配置文件未找到.')

    the_config = Config.load(config_dict)

    return the_config


config = load_config()
