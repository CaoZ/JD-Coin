import logging

logger = logging.getLogger('jobs')

from .bean import Bean
from .bean_app import BeanApp
from .bean_jr import BeanJR
from .daka import Daka
from .daka_app import DakaApp

__all__ = ['jobs_all', 'logger']

jobs_mobile = [Daka, DakaApp, BeanApp]
jobs_web = [Bean, BeanJR]
jobs_all = jobs_mobile + jobs_web


def set_logger():
    logger.propagate = False
    logger.setLevel(logging.INFO)
    handler = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s %(name)s[%(module)s] %(levelname)s: %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)


set_logger()
