import os
from base64 import b85decode


def get_qq():
    try:
        account = int(b85decode(os.getenv('QQ_ACCOUNT')))
        password = b85decode(os.getenv('QQ_PASSWORD')).decode()
    except Exception as e:
        raise ('获取 QQ 帐号出错: ' + repr(e))

    return {
        'account': account,
        'password': password
    }


qq = get_qq()
