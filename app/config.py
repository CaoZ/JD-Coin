import argparse
import logging
import sys
from base64 import b85decode
from configparser import ConfigParser
from pathlib import Path

#日志配置
logger = logging.getLogger('JD-Coin')
log_format = '%(asctime)s %(name)s %(levelname)s: %(message)s'
# logging.basicConfig(format=log_format, level=logging.INFO)
logger.propagate = False
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter(log_format)
handler.setFormatter(formatter)
logger.addHandler(handler)


class User:
    def __init__(self, conf_section: ConfigParser):
        self.debug = False
        self.headless = False
        self.logger = logger
        self.ua_pc = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/62.0.3202.94 Chrome/62.0.3202.94 Safari/537.36'
        self.ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Version/11.0 Mobile/15C114 Safari/604.1'
        self.__load__(conf_section)

    def __load__(self, cs: ConfigParser):
        '''
        从配置文件中初始化一个用户的信息
        :param cs: ConfigParser Section
        :return:
        '''
        self.debug = cs.getboolean('Debug', False)
        self.headless = cs.getboolean('Headless', False)

        try:
            real_username = b85decode(cs['Username']).decode()
            real_password = b85decode(cs['Password']).decode()
            self.logger = logger.getChild(real_username)
            self.username = real_username
            self.password = real_password
        except Exception as e:
            logger.error('获取京东帐号出错: ' + repr(e))

        self.jobs_skip = cs.get('Jobs_skip', [])
        # the_config.cookiesname = real_username
        self.cookiesname = '{0}.cookies'.format(real_username)
        return self


def load_config():
    config = ConfigParser()
    # 开启大小写敏感
    config.optionxform = str
    parser = argparse.ArgumentParser()
    parser.add_argument('-c', '--config', help='config file name')
    args = parser.parse_args()

    config_name = args.config or 'config.ini'
    logger.info('使用配置文件 "{}".'.format(config_name))

    config_file = Path(__file__).parent.joinpath('../conf/', config_name)

    if not config_file.exists():
        config_name = 'config.default.ini'
        logger.warning('配置文件不存在, 使用默认配置文件 "{}".'.format(config_name))
        config_file = config_file.parent.joinpath(config_name)

    try:
        # 略坑, Path.resolve() 在 3.5 和 3.6 上表现不一致... 若文件不存在 3.5 直接抛异常, 而 3.6
        # 只有 Path.resolve(strict=True) 才抛, 但 strict 默认为 False.
        # 感觉 3.6 的更合理些...
        config_file = config_file.resolve()
        config.read(config_file)
    except Exception as e:
        sys.exit('# 错误: 配置文件载入失败: {}'.format(e))
    return config
    # the_config = Config.load(config_dict)

    # return the_config


def get_users():
    '''
    返回用户对象
    '''
    config = load_config()
    users = list()
    for section in config.sections():
        if config[section].getboolean('Enable'):
            user = User(config[section])
            users.append(user)
    return users


# config为未作修改的原生配置对象，加载自config.ini
users = get_users()
