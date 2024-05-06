import logging

logging.basicConfig(level=logging.INFO, format='[API]: %(message)s')

def info(message):
    logging.info(message)

def error(message):
    logging.error(message)
