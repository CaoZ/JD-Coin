from .bean import Bean
from .bean_app import BeanApp
from .bean_jr import BeanJR
from .daka import Daka
from .daka_app import DakaApp

jobs_mobile = [Daka, DakaApp, BeanApp]
jobs_web = [Bean, BeanJR]
jobs_all = jobs_mobile + jobs_web
