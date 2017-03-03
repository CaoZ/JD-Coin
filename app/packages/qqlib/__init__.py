'''
QQ Login module
Licensed to MIT
'''

import hashlib, re, binascii, base64
import rsa, requests
from . import tea

__all__ = ['QQ', 'LogInError', 'NeedVerifyCode']

class LogInError(Exception): pass

class NeedVerifyCode(Exception):
    def __init__(self, verifier, message=None):
        Exception.__init__(self)
        self.verifier = verifier
        self.message = message

class Verifier:
    url_check = 'http://check.ptlogin2.qq.com/check'
    url_gettype = 'http://captcha.qq.com/cap_union_new_gettype'
    url_getsig = 'http://captcha.qq.com/cap_union_new_getsig'
    url_getimage = 'http://captcha.qq.com/cap_union_new_getcapbysig'
    url_verify = 'http://captcha.qq.com/cap_union_new_verify'

    def __init__(self, parent):
        self.parent = parent
        self.sess = None

    def check(self):
        parent = self.parent
        login_sig = parent.session.cookies['pt_login_sig']
        g = parent.fetch(self.url_check, params={
            'pt_tea': 2,
            'uin': parent.user,
            'appid': parent.appid,
            'js_ver': parent.js_ver,
            'js_type': 1,
            'u1': parent.url_success,
            'login_sig': login_sig,
        }).text
        v = re.findall('\'(.*?)\'', g)
        self.pt_vcode_v1, self.cap_cd, self.uin, self.ptvfsession = v[:4]
        if self.pt_vcode_v1 == '1':
            self.throw()
        else:
            self.vcode = self.cap_cd

    def get_type(self):
        parent = self.parent
        g = parent.fetch(self.url_gettype, params={
            'aid': parent.appid,
            'protocol': 'http',
            'clienttype': 2,
            'apptype': 2,
            'curenv': 'inner',
            'uid': parent.user,
            'cap_cd': self.cap_cd,
            'callback': '_qqlib_',
        }).text
        m = re.search('"sess":"(.*?)"', g)
        self.sess = m.group(1)

    def fetch_image(self):
        parent = self.parent
        if self.sess is None:
            self.get_type()
        g = parent.fetch(self.url_getsig, params={
            'aid': parent.appid,
            'protocol': 'http',
            'clienttype': 2,
            'apptype': 2,
            'curenv': 'inner',
            'sess': self.sess,
            'uid': parent.user,
            'cap_cd': self.cap_cd,
        }).json()
        self.vsig = g['vsig']
        r = parent.fetch(self.url_getimage, params={
            'aid': parent.appid,
            'protocol': 'http',
            'clienttype': 2,
            'apptype': 2,
            'curenv': 'inner',
            'sess': self.sess,
            'uid': parent.user,
            'cap_cd': self.cap_cd,
            'vsig': self.vsig,
            'showtype': 'embed',
            'ischartype': 1,
        })
        return r.content

    def verify(self, vcode):
        parent = self.parent
        r = parent.fetch(self.url_verify, data={
            'aid': parent.appid,
            'protocol': 'http',
            'clientype': 2,
            'apptype': 2,
            'curenv': 'inner',
            'sess': self.sess,
            'uid': parent.user,
            'cap_cd': self.cap_cd,
            'vsig': self.vsig,
            'ans': vcode,
        })
        r.encoding='utf-8'
        g = r.json()
        if g['errorCode'] != '0':
            self.throw(g['errMessage'])
        self.vcode = g['randstr']
        self.ptvfsession = g['ticket']

    def throw(self, message=None):
        raise NeedVerifyCode(self, message)

class QQ:
    appid = 549000912
    action = '4-22-1450611437613'
    url_success = 'http://qzs.qq.com/qzone/v5/loginsucc.html?para=izone'
    js_ver = 10171

    def __init__(self, user, pwd):
        self.user = user
        self.pwd = pwd
        self.nick = None
        self.verifier = None
        self.session = requests.Session()
        self.xlogin()

    def fetch(self, url, data=None, **kw):
        if data is None:
            func = self.session.get
        else:
            kw['data'] = data
            func = self.session.post
        return func(url, **kw)

    url_xlogin = 'http://xui.ptlogin2.qq.com/cgi-bin/xlogin'
    def xlogin(self):
        '''
        Get a log-in signature in cookies.
        '''
        self.fetch(self.url_xlogin, params={
            'proxy_url': 'http://qzs.qq.com/qzone/v6/portal/proxy.html',
            'daid': 5,
            'no_verifyimg': 1,
            'appid': self.appid,
            's_url': self.url_success,
        })

    url_login = 'http://ptlogin2.qq.com/login'
    def login(self, force=False):
        login_sig = self.session.cookies['pt_login_sig']
        if force:
            self.verifier = None
        if self.verifier is None:
            verifier = self.verifier = Verifier(self)
            verifier.check()
        else:
            verifier = self.verifier
        ptvfsession = verifier.ptvfsession or self.session.cookies.get('ptvfsession', '')
        g = self.fetch(self.url_login, params={
            'u': self.user,
            'verifycode': verifier.vcode,
            'pt_vcode_v1': verifier.pt_vcode_v1,
            'pt_verifysession_v1': ptvfsession,
            'p': self.pwdencode(verifier.vcode, verifier.uin, self.pwd),
            'pt_randsalt': 0,
            'u1': self.url_success,
            'ptredirect': 0,
            'h': 1,
            't': 1,
            'g': 1,
            'from_ui': 1,
            'ptlang': 2052,
            'action': self.action,
            'js_ver': self.js_ver,
            'js_type': 1,
            'aid': self.appid,
            'daid': 5,
            'login_sig': login_sig,
        }).text
        r = re.findall('\'(.*?)\'', g)
        if r[0] == '4':
            verifier.throw(r[4])
        if r[0] != '0':
            raise LogInError(r[4])
        self.nick = r[5]
        self.fetch(r[2])
        self.verifier = None

    def fromhex(self, s):
        # Python 3: bytes.fromhex
        return bytes(bytearray.fromhex(s))

    pubKey = rsa.PublicKey(int(
        'F20CE00BAE5361F8FA3AE9CEFA495362'
        'FF7DA1BA628F64A347F0A8C012BF0B25'
        '4A30CD92ABFFE7A6EE0DC424CB6166F8'
        '819EFA5BCCB20EDFB4AD02E412CCF579'
        'B1CA711D55B8B0B3AEB60153D5E0693A'
        '2A86F3167D7847A0CB8B00004716A909'
        '5D9BADC977CBB804DBDCBA6029A97108'
        '69A453F27DFDDF83C016D928B3CBF4C7',
        16
    ), 3)
    def pwdencode(self, vcode, uin, pwd):
        '''
        Encode password with tea.
        '''
        # uin is the bytes of QQ number stored in unsigned long (8 bytes)
        salt = uin.replace(r'\x', '')
        h1 = hashlib.md5(pwd.encode()).digest()
        s2 = hashlib.md5(h1 + self.fromhex(salt)).hexdigest().upper()
        rsaH1 = binascii.b2a_hex(rsa.encrypt(h1, self.pubKey)).decode()
        rsaH1Len = hex(len(rsaH1) // 2)[2:]
        hexVcode = binascii.b2a_hex(vcode.upper().encode()).decode()
        vcodeLen = hex(len(hexVcode) // 2)[2:]
        l = len(vcodeLen)
        if l < 4:
            vcodeLen = '0' * (4 - l) + vcodeLen
        l = len(rsaH1Len)
        if l < 4:
            rsaH1Len = '0' * (4 - l) + rsaH1Len
        pwd1 = rsaH1Len + rsaH1 + salt + vcodeLen + hexVcode
        saltPwd = base64.b64encode(
            tea.encrypt(self.fromhex(pwd1), self.fromhex(s2))
        ).decode().replace('/', '-').replace('+', '*').replace('=', '_')
        return saltPwd
