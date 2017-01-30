#!/usr/bin/env python
# coding=utf-8
import getpass, sys, tempfile, os
from . import QQ, VerifyCodeError, NeedVerifyCode

quser = input('请输入QQ：')
qpwd = getpass.getpass('请输入密码：')

qq = QQ(quser, qpwd)
while True:
    try:
        qq.login()
    except NeedVerifyCode:
        e = sys.exc_info()[1]
        verifier = e.verifier
        fd, path = tempfile.mkstemp(suffix = '.jpg')
        os.write(fd, verifier.image)
        os.close(fd)
        print('验证码已保存到：', path)
        vcode = input('请输入验证码：')
        os.remove(path)
        try:
            verifier.verify(vcode)
        except VerifyCodeError:
            print('验证码错误！')
            raise sys.exc_info()[1]
    else:
        break
print('Hi, %s' % qq.nick)
