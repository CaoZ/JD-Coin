import os
import re
import subprocess
import sys
import tempfile

from packages.py_imgcat import imgcat


def find_value(pattern, string, default=None, flags=0):
    """
    根据正则表达式在字符串中搜索值，若未找到，返回 default
    """
    m = re.search(pattern, string, flags)

    if m:
        return m.group(1)
    else:
        return default


def show_image(image_data):
    if os.getenv('TERM_PROGRAM') == 'iTerm.app' and os.getenv('TERM_PROGRAM_VERSION', '') > '2.9':
        # iTerm2 2.9 以上版本支持图片显示
        imgcat(image_data)

    else:
        # 保存图片, 然后打开
        fd, file_path = tempfile.mkstemp(suffix='.jpg')
        os.write(fd, image_data)
        os.close(fd)

        if sys.platform.startswith('darwin'):
            subprocess.call(('open', file_path))
        elif os.name == 'nt':
            os.startfile(file_path)
        elif os.name == 'posix':
            subprocess.call(('xdg-open', file_path))
