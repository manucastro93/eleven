from lxml import etree
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
TA_FILE = os.path.join(BASE_DIR, "ta_ws_sr_padron.xml")

def cargar_ta():
    if not os.path.exists(TA_FILE):
        from afip.servidor import login_wsaa  # ejecuta para generar el TA
        login_wsaa()  # genera el archivo si no existe

    with open(TA_FILE, "r", encoding="UTF-8") as f:
        tree = etree.fromstring(f.read().encode("utf-8"))

    token = tree.findtext(".//token")
    sign = tree.findtext(".//sign")
    return token, sign
