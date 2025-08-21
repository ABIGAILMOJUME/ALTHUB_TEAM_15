import logging
import logging.handlers


PAPERTRAIL_HOST = 'logs2.papertrailapp.com'
PAPERTRAIL_PORT = 50951


logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s %(levelname)s %(name)s %(message)s"
)

def get_logger(name):
    logger = logging.getLogger(name)
    return logger
