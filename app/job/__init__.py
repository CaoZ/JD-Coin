

from app.config import log_format
from .bean import Bean
from .bean_app import BeanApp
from .bean_jr import SignJR
from .daka_app import DakaApp
from .data_station import DataStation
from .double_jr import DoubleSign_JR
from .jdstock_sign import JDStock_Sign

__all__ = ['jobs_all']

# 此处对PC端和移动端的区分，建议在各个job中用属性区分
# jobs_mobile = [DakaApp, BeanApp, DataStation,DoubleSign_JR]
# jobs_web = [Bean, SignJR]
# jobs_all = jobs_mobile + jobs_web
jobs_all = [Bean, SignJR, DakaApp, BeanApp, DataStation, JDStock_Sign, DoubleSign_JR]


