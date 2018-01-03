# -*- coding: utf-8 -*-
import hashlib
import urllib
import base64
import requests


def md5str(str):
    m = hashlib.md5(str.encode(encoding="utf-8"))
    return m.hexdigest()


def md5(byte):
    return hashlib.md5(byte).hexdigest()


class DamatuApi():

    ID = '40838'
    KEY = 'ca9507e17e8d5ddf7c57cd18d8d33010'
    HOST = 'http://api.dama2.com:7766/app/'

    def __init__(self, username, password):
        self.username = username
        self.password = password

    def getSign(self, param=''):
        return (md5(self.KEY + self.username + param))[:8]

    def getPwd(self):
        return md5str(self.KEY + md5str(md5str(self.username) + md5str(self.password)))

    def post(self, path, params={}):
        url = self.HOST + path
        r = requests.post(url, data=params)
        return r.json()

    # 查询余额 return 是正数为余额 如果为负数 则为错误码
    def getBalance(self):
        data = {
            'appID': self.ID,
            'user': self.username,
            'pwd': self.getPwd(),
            'sign': self.getSign()
        }
        jres = self.post('d2Balance', data)
        if jres['ret'] == 0:
            return jres['balance']
        else:
            return jres['ret']

    # 上传验证码 参数filePath 验证码图片路径 如d:/1.jpg type是类型，查看http://wiki.dama2.com/index.php?n=ApiDoc.Pricedesc  return 是答案为成功 如果为负数 则为错误码
    def decode(self, filePath, type):
        f = open(filePath, 'rb')
        fdata = f.read()
        filedata = base64.b64encode(fdata)
        f.close()
        data = {
            'appID': self.ID,
            'user': self.username,
            'pwd': self.getPwd(),
            'type': type,
            'fileDataBase64': filedata,
            'sign': self.getSign(fdata),
        }
        jres = self.post('d2File', data)
        if jres['ret'] == 0:
            # 注意这个json里面有ret，id，result，cookie，根据自己的需要获取
            return(jres['result'])
        else:
            return jres['ret']

    # url地址打码 参数 url地址  type是类型(类型查看http://wiki.dama2.com/index.php?n=ApiDoc.Pricedesc) return 是答案为成功 如果为负数 则为错误码
    def decodeUrl(self, url, type):
        data = {
            'appID': self.ID,
            'user': self.username,
            'pwd': self.getPwd(),
            'type': type,
            'url': urllib.quote(url),
            'sign': self.getSign(url.encode(encoding="utf-8")),
        }
        jres = self.post('d2Url', data)
        if jres['ret'] == 0:
            # 注意这个json里面有ret，id，result，cookie，根据自己的需要获取
            return(jres['result'])
        else:
            return jres['ret']

    # 报错 参数id(string类型)由上传打码函数的结果获得 return 0为成功 其他见错误码
    def reportError(self, id):
        # f=open('0349.bmp','rb')
        # fdata=f.read()
        # print(md5(fdata))
        data = {
            'appID': self.ID,
            'user': self.username,
            'pwd': self.getPwd(),
            'id': id,
            'sign': self.getSign(id.encode(encoding="utf-8")),
        }
        jres = self.post('d2ReportError', data)
        return jres['ret']


if __name__ == '__main__':
    # 调用类型实例：
    # 1.实例化类型 参数是打码兔用户账号和密码
    dmt = DamatuApi("vincent2016", "1Ja3BIZH2Jny")
    # dmt = DamatuApi("jackon", "f3PSi2u1")
    # 2.调用方法：
    print(dmt.getBalance())  # 查询余额
    # print(dmt.decode('img-captcha/55d03197041e97841f7ba9ecc9ec6a99.jpg', 200))  # 上传打码
    print(dmt.decodeUrl('http://captcha.qq.com/getimage?aid=549000912&r=0.7257105156128585&uin=3056517021', 200))  # 上传打码
    # print(dmt.reportError('894657096')) #上报错误
