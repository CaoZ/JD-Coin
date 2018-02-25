import locale
import urllib.parse
import urllib.request
from http.cookies import SimpleCookie
from pathlib import Path

from PyQt5 import QtCore
from PyQt5.QtCore import QUrl, QTimer
from PyQt5.QtGui import QIcon
from PyQt5.QtNetwork import QNetworkProxy
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtWidgets import QApplication
from requests.cookies import RequestsCookieJar

from config import config

# 过滤掉一些不需要的 Qt WebEngine 日志输出
# https://stackoverflow.com/questions/35894171/redirect-qdebug-output-to-file-with-pyqt5
QtCore.qInstallMessageHandler(lambda *args: None)

APP = None


class MobileBrowser(QWebEngineView):
    def __init__(self):
        QWebEngineView.__init__(self)

        self.config()
        self.set_trigger()

        # WebEngine 的 cookie store 没提供获取 cookie 的方法，因此只能通过 cookieAdded 事件捕获。
        # 不能用 SimpleCookie, 因为 SimpleCookie 仅以 cookie name 作为 key, 不能存储 name 相同而 domain 不同
        # 的 cookie, 后者会覆盖前者, 导致 cookie 丢失. 比如, 京东登录成功后会返回:
        # pin=***; expires=Fri, 14-Apr-2017 17:29:28 GMT; domain=.jd.com; path=/
        # pin=***; expires=Fri, 14-Apr-2017 17:29:28 GMT; domain=.360buy.com; path=/
        # 等一系列同名 cookie.
        self.cookies = RequestsCookieJar()

        # 当到达 target 时自动关闭浏览器窗口
        self.target = None

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
        simple_cookie = SimpleCookie(raw_form)

        for cookie in simple_cookie.values():
            self.cookies.set(cookie.key, cookie)

    def load(self, url: QUrl):
        self.target = url
        super().load(url)

    def load_finished(self, success):
        """
        自动登录动作
        """
        if success:
            self.apply_actions(self.url().host())

    def apply_actions(self, host):
        """
        根据地址完成自动填充/登录/关闭窗口动作
        """
        code = None

        if host == 'plogin.m.jd.com':
            code = """
            $('#username').val('{username}');
            $('#password').val('{password}');
            
            if ({auto_submit}) {{
                $('#loginBtn').addClass('btn-active');
                $('#loginBtn').click();
            }} else {{
                $('#username').focus();
            }}
            """

        elif host == 'passport.jd.com':
            code = """
            $(document).scrollLeft($(document).width());  // 移动到页面最右侧
            $('.login-tab-r').click();
            $('#loginname').val('{username}');
            $('#nloginpwd').val('{password}');
            $('#autoLogin').prop('checked', true);
            if ({auto_submit}) $('#loginsubmit').click();
            """

        if code:
            code = code.format_map(config.jd)
            self.page().runJavaScript(code)

        if host == self.target.host():
            self.setWindowTitle('👌 登录成功，窗口即将关闭...')

            timer = QTimer(self)
            timer.timeout.connect(self.close)
            timer.start(1000)


def get_cookies(url):
    starting_up = QApplication.startingUp()

    if starting_up:
        global APP
        APP = QApplication([])
        icon_path = str(Path(__file__, '../jd.png').resolve())
        APP.setWindowIcon(QIcon(icon_path))

    the_browser = MobileBrowser()
    the_browser.load(QUrl(url))

    if starting_up:
        # On Unix/Linux Qt is configured to use the system locale settings by default. This can cause a conflict when using POSIX functions.
        # http://doc.qt.io/qt-5/qcoreapplication.html#locale-settings
        # 重设 locale, 否则某些依赖 locale 的代码可能产生错误, 如 Requests 中解析 cookie 时间的代码.
        locale.setlocale(locale.LC_TIME, 'C')

    APP.exec()

    return the_browser.cookies


def main():
    test_url = 'https://m.jd.com'
    cookies = get_cookies(test_url)


if __name__ == '__main__':
    main()
