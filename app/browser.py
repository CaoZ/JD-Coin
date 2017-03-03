import urllib.parse
import urllib.request
from http.cookies import SimpleCookie
from pathlib import Path

from PyQt5.QtCore import QUrl
from PyQt5.QtGui import QIcon
from PyQt5.QtNetwork import QNetworkProxy
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtWidgets import QApplication
from requests.cookies import RequestsCookieJar

from config import config

APP = None


class MobileBrowser(QWebEngineView):
    def __init__(self):
        QWebEngineView.__init__(self)

        self.config()
        self.set_trigger()

        # WebEngine 的 cookie store 没提供获取 cookie 的方法，因此只能通过 cookieAdded 事件捕获。
        self.cookies = SimpleCookie()

        self.show()

        # 最前显示
        self.raise_()
        self.activateWindow()

    def config(self):
        self.page().profile().setHttpUserAgent(config.ua)

        proxies = urllib.request.getproxies()
        http_proxy = proxies.get('http') or proxies.get('https')

        if http_proxy:
            parsed = urllib.parse.urlparse(http_proxy)
            proxy = QNetworkProxy()
            proxy.setType(QNetworkProxy.HttpProxy)
            proxy.setHostName(parsed.hostname)
            proxy.setPort(parsed.port)
            QNetworkProxy.setApplicationProxy(proxy)

        # NoPersistentCookies, Both session and persistent cookies are stored in memory.
        # http://doc.qt.io/qt-5/qwebengineprofile.html#PersistentCookiesPolicy-enum
        # cookies 会同步到 python 中，无需由 WebEngine 保存。若保存了，cookieAdded 会触发两次，一次从文件（缓存）加载，
        # 一次页面中 Set-Cookie 指令加载，反而复杂了。
        self.page().profile().setPersistentCookiesPolicy(0)
        self.setZoomFactor(1.2)  # 放大一下, 验证码看的清楚...

    def set_trigger(self):
        self.titleChanged.connect(self.title_changed)
        self.loadFinished.connect(self.load_finished)

        cookie_store = self.page().profile().cookieStore()
        cookie_store.cookieAdded.connect(self.cookie_added)

    def title_changed(self, title):
        self.setWindowTitle(title)

    def cookie_added(self, cookie):
        raw_form = bytes(cookie.toRawForm()).decode()
        self.cookies.load(raw_form)

    def load_finished(self, success):
        """
        自动登录动作
        """
        if success:
            self.auto_login(self.url().host())

    def get_cookies(self):
        cookie_jar = RequestsCookieJar()

        for cookie_name in self.cookies:
            cookie = self.cookies[cookie_name]
            cookie_jar.set(cookie.key, cookie)

        return cookie_jar

    def auto_login(self, host):
        """
        根据地址完成自动填充/登录动作
        """
        code = None

        if host == 'plogin.m.jd.com':
            code = """
            $('#username').val('{username}');
            $('#password').val('{password}');
            $('#code').focus();
            """

        elif host == 'passport.jd.com':
            code = """
            $(document).scrollLeft($(document).width());  // 移动到页面最右侧
            $('.login-tab-r').click();
            $('#loginname').val('{username}');
            $('#nloginpwd').val('{password}');
            $('#autoLogin').prop('checked', true);
            $('#loginsubmit').click();
            """

        if code:
            code = code.format_map(config.jd)
            self.page().runJavaScript(code)


def get_cookies(url):
    global APP

    if not APP:
        APP = QApplication([])
        icon_path = str(Path(__file__, '../jd.png').resolve())
        APP.setWindowIcon(QIcon(icon_path))

    browser = MobileBrowser()
    browser.load(QUrl(url))

    APP.exec()

    cookie_jar = browser.get_cookies()
    return cookie_jar


def main():
    test_url = 'https://m.jd.com'
    get_cookies(test_url)


if __name__ == '__main__':
    main()
