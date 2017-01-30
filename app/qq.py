from packages.qqlib import QQ


class JDQQ(QQ):
    appid = 716027609
    url_success = 'https://graph.qq.com/oauth/login_jump'

    def __init__(self, user, pwd, session):
        self.user = user
        self.pwd = pwd
        self.nick = None
        self.verifier = None
        self.session = session
        self.xlogin()

    def g_tk(self):
        h = 5381
        cookies = self.session.cookies
        s = cookies.get('skey') or cookies.get('p_skey') or ''
        for c in s:
            h += (h << 5) + ord(c)
        return h & 0x7fffffff
