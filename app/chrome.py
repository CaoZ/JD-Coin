import time
from urllib.parse import urlparse

import job
from requests.cookies import RequestsCookieJar
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException, WebDriverException


class MobileChrome:
    WIDTH = 480
    HEIGHT = 800
    UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Version/11.0 Mobile/15C114 Safari/604.1'

    def __init__(self, signbot):
        self.config = signbot.config
        try:
            options = webdriver.ChromeOptions()
            if self.config.headless:
                options.add_argument('--headless')
            options.add_argument('lang=zh_CN.UTF-8')
            options.add_argument('user-agent={0}'.format(self.UA))
            self.driver = webdriver.Chrome(chrome_options=options)
        except WebDriverException:
            options = webdriver.FirefoxOptions()
            options.set_headless(True)
            options.set_preference('general.useragent.override',self.UA)
            options.set_preference('intl.accept_languages','zh-cn,zh,en-us,en')
            self.driver = webdriver.Firefox(options=options)
        self.driver.set_window_size(width=self.WIDTH, height=self.HEIGHT)
        self.cookies = RequestsCookieJar()
        self.logger = job.logger

    def login(self, url='https://home.m.jd.com'):
        '''
        京东触屏版登陆
        :param usrname:
        :param passwd:
        :return:
        '''
        d = self.driver
        d.get(url)
        user_input = d.find_element_by_id('username')
        password_input = d.find_element_by_id('password')
        login_btn = d.find_element_by_id('loginBtn')
        user_input.send_keys(self.config.jd['username'])
        password_input.send_keys(self.config.jd['password'])
        if self.config.jd['password'] != '':
            login_btn.click()
            time.sleep(6)
            nickname = self.driver.find_element_by_css_selector('#myHeader span[class$="name_text"]')
            self.nickname = nickname.text
            self.logger.info('登陆成功，欢迎{}'.format(self.nickname))
        else:
            input('请输入账户密码')
        self.__cookies_to_requests__()
        print('登陆成功')

    def load_session(self):
        pass

    def __cookies_to_requests__(self):
        # try:
        #     self.driver.find_elements_by_id('userName')
        # except IOError:
        #     print('哈哈')
        cookies_list = self.driver.get_cookies()
        for cookie in cookies_list:
            try:
                cookie = self.__standardize_cookie__(cookie)
                cookiename = cookie.pop('name')
                cookieval = cookie.pop('value')
            except KeyError:
                pass
            # self.cookies.set(name=cookie['name'],value=cookie['value'],
            #                 domain=cookie['domain'],path=cookie['path'],
            #                  expires=cookie['expiry'],rest={'HttpOnly': cookie['httpOnly']},
            #                  secure=cookie['secure'])
            self.cookies.set(cookiename, cookieval, **cookie)
            # self.cookies.set_cookie(cookie)

    def __standardize_cookie__(self, cookie):
        c = cookie.copy()
        need_fix = [('expires', 'expiry')]
        try:
            c['rest'] = {'HttpOnly': c.pop('httpOnly')}
        except KeyError:
            pass
        for (newkey, oldkey) in need_fix:
            try:

                c[newkey] = c.pop(oldkey)
            except (KeyError, TypeError):
                pass
        return c

    def quit(self):
        self.driver.close()


class PcChrome(MobileChrome):
    UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/62.0.3202.94 Chrome/62.0.3202.94 Safari/537.36'
    WIDTH = 1024
    HEIGHT = 768

    def login(self, url):
        d = self.driver
        d.get(url)
        switcher = d.find_element_by_link_text('账户登录')
        switcher.click()
        user_input = d.find_element_by_id('loginname')
        password_input = d.find_element_by_id('nloginpwd')
        login_btn = d.find_element_by_id('loginsubmit')
        user_input.send_keys(self.config.jd['username'])
        password_input.send_keys(self.config.jd['password'])
        if self.config.jd['password'] != '':
            login_btn.click()
            time.sleep(6)
            try:
                nickname = self.driver.find_element_by_css_selector('#shortcut-2014 a[class=nickname]')
                self.nickname = nickname.text
                self.logger.info('登陆成功，欢迎{}'.format(self.nickname))
            except NoSuchElementException:
                self.logger.warn('登陆异常，请检查是否需要验证码')
        else:
            input('请输入账户密码')
        self.__cookies_to_requests__()


def get_cookies(url, signbot) -> RequestsCookieJar:
    host = urlparse(url).netloc
    if host[-8:] == 'm.jd.com':
        bot = MobileChrome(signbot)
    else:
        bot = PcChrome(signbot)
    bot.login(url)
    cookiejar = bot.cookies
    bot.quit()
    return cookiejar
