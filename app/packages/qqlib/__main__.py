import getpass, sys, tempfile, os
from . import QQ, NeedVerifyCode

quser = input('QQ: ')
qpwd = getpass.getpass('Password: ')

qq = QQ(quser, qpwd)
exc = None
while True:
    try:
        if exc is None:
            qq.login()
            break
        else:
            if exc.message:
                print('Error:', exc.message)
            verifier = exc.verifier
            fd, path = tempfile.mkstemp(suffix='.jpg')
            os.write(fd, verifier.fetch_image())
            os.close(fd)
            print('Verify code is saved to:', path)
            vcode = input('Input verify code: ')
            os.remove(path)
            verifier.verify(vcode)
            exc = None
    except NeedVerifyCode:
        exc = sys.exc_info()[1]
print('Hi, %s' % qq.nick)
