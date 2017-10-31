import logging

logger = logging.getLogger('jobs')

from config import config
from .bean import Bean
from .bean_app import BeanApp
from .bean_jr import SignJR
from .daka_app import DakaApp
from .data_station import DataStation

__all__ = ['jobs_all', 'logger']

jobs_mobile = [DakaApp, BeanApp, DataStation]
jobs_web = [Bean, SignJR]
jobs_all = jobs_mobile + jobs_web


def set_logger():
    logger.propagate = False
    logger.setLevel(logging.INFO)
    handler = logging.StreamHandler()
    formatter = logging.Formatter(config.log_format)
    handler.setFormatter(formatter)
    logger.addHandler(handler)


set_logger()
