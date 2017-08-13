import re

from requests import Response


class RequestError(Exception):
    def __init__(self, message, code: str = None, response: Response = None):
        self.message = message
        self.code = code
        self.response = response


def find_value(pattern, string, default=None, flags=0):
    """
    根据正则表达式在字符串中搜索值，若未找到，返回 default
    """
    m = re.search(pattern, string, flags)

    if m:
        return m.group(1)
    else:
        return default
