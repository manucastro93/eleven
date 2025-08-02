from fastapi import FastAPI
from datetime import datetime, timedelta
import uuid
from lxml import etree
import subprocess
import tempfile
import base64
import requests
import os
import re
import traceback
from email.utils import parsedate_to_datetime
from afip.utils.padron import consultar_padron
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Cargar variables del .env
load_dotenv()

app = FastAPI()

# Paths base
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
AFIP_DIR = BASE_DIR
TEMPLATES_DIR = os.path.join(AFIP_DIR, "templates")
CERT_FILE = os.path.join(AFIP_DIR, "certificadoAFIP_ws_sr_padron.pem")
KEY_FILE = os.path.join(AFIP_DIR, "clave_privada_ws_sr_padron.key")
DEBUG_DIR = os.path.join(AFIP_DIR, "debug")
os.makedirs(DEBUG_DIR, exist_ok=True)

# Constantes AFIP
SERVICE = "ws_sr_constancia_inscripcion"
WSAA_URL = "https://wsaa.afip.gov.ar/ws/services/LoginCms"
DEST_DN = "CN=wsaa,o=afip,c=ar,serialNumber=CUIT 33693450239"

# CORS para frontend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def format_afip_datetime(dt: datetime) -> str:
    return dt.strftime('%Y-%m-%dT%H:%M:%S-03:00')

def obtener_hora_afip() -> datetime:
    res = requests.head("https://wsaa.afip.gov.ar/ws/services/LoginCms")
    return parsedate_to_datetime(res.headers["Date"]).astimezone()

@app.get("/padron/{cuit}")
def padron_route(cuit: str):
    return consultar_padron(cuit)

@app.get("/wsaa/login")
def login_wsaa():
    tra_path, signed_path = None, None
    try:
        # Verificaciones necesarias
        if not os.path.exists(CERT_FILE):
            raise FileNotFoundError(f"Certificado no encontrado: {CERT_FILE}")
        if not os.path.exists(KEY_FILE):
            raise FileNotFoundError(f"Clave privada no encontrada: {KEY_FILE}")
        if not os.getenv("PASSPHRASE_PRIVADA"):
            raise EnvironmentError("La variable PASSPHRASE_PRIVADA no está definida. Verificá tu archivo .env.")

        # Hora oficial AFIP
        now_afip = obtener_hora_afip()
        uid = int(now_afip.timestamp())
        gen_time = format_afip_datetime(now_afip - timedelta(minutes=10))
        exp_time = format_afip_datetime(now_afip + timedelta(minutes=10))

        # Leer y completar el TRA
        with open(os.path.join(TEMPLATES_DIR, "tra_template.xml"), "r", encoding="UTF-8") as f:
            tra = f.read()

        tra = tra.replace("<destination>...</destination>", f"<destination>{DEST_DN}</destination>")
        tra = tra.replace("<uniqueId>...</uniqueId>", f"<uniqueId>{uid}</uniqueId>")
        tra = tra.replace("<generationTime>...</generationTime>", f"<generationTime>{gen_time}</generationTime>")
        tra = tra.replace("<expirationTime>...</expirationTime>", f"<expirationTime>{exp_time}</expirationTime>")
        tra = tra.replace("<service>...</service>", f"<service>{SERVICE}</service>")
        tra = re.sub(r'>\s*<', '><', tra.strip())

        with open(os.path.join(DEBUG_DIR, "tra_debug_final.xml"), "w", encoding="UTF-8") as f:
            f.write(tra)

        # Firmar con OpenSSL
        with tempfile.NamedTemporaryFile(delete=False, suffix=".xml", mode="w", encoding="UTF-8") as tra_file:
            tra_path = tra_file.name
            tra_file.write(tra)

        signed_path = tra_path + ".signed"

        subprocess.run([
            "openssl", "cms", "-sign",
            "-in", tra_path,
            "-signer", CERT_FILE,
            "-inkey", KEY_FILE,
            "-out", signed_path,
            "-outform", "DER",
            "-nodetach", "-nosmimecap", "-binary",
            "-passin", "env:PASSPHRASE_PRIVADA"
        ], check=True)

        # Codificar CMS a base64
        with open(signed_path, "rb") as f:
            cms_bin = f.read()

        cms_b64 = base64.b64encode(cms_bin).decode("UTF-8").replace("\n", "").replace("\r", "")
        with open(os.path.join(DEBUG_DIR, "cms_debug.b64"), "w", encoding="UTF-8") as f:
            f.write(cms_b64)

        # Armar SOAP
        soap = f"""<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://wsaa.view.sua.dvadac.desein.afip.gov.ar">
  <soapenv:Header/>
  <soapenv:Body>
    <ws:loginCms>
      <ws:in0><![CDATA[{cms_b64}]]></ws:in0>
    </ws:loginCms>
  </soapenv:Body>
</soapenv:Envelope>"""

        with open(os.path.join(DEBUG_DIR, "soap_debug_enviado.xml"), "w", encoding="UTF-8") as f:
            f.write(soap)

        # Enviar a AFIP
        headers = {
            "Content-Type": "text/xml; charset=UTF-8",
            "SOAPAction": "loginCms"
        }
        res = requests.post(WSAA_URL, headers=headers, data=soap.encode("UTF-8"))

        if res.status_code != 200:
            return {"status": res.status_code, "error": "AFIP WSAA error", "body": res.text}

        # Parseo de respuesta
        tree = etree.fromstring(res.content)
        ns = {
            'soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
            'ns': 'http://wsaa.view.sua.dvadac.desein.afip.gov.ar'
        }

        login_cms_return = tree.find('.//ns:loginCmsReturn', namespaces=ns)
        if login_cms_return is None:
            return {"status": 500, "error": "loginCmsReturn not found"}

        inner_xml = login_cms_return.text
        inner_tree = etree.fromstring(inner_xml.encode("utf-8"))

        token = inner_tree.findtext(".//token")
        sign = inner_tree.findtext(".//sign")

        with open(os.path.join(BASE_DIR, "ta_ws_sr_padron.xml"), "w", encoding="UTF-8") as f:
            f.write(inner_xml)

        return {
            "token": token,
            "sign": sign,
            "ta_raw": inner_xml
        }

    except Exception as e:
        traceback.print_exc()
        return {"status": 500, "error": str(e)}
    finally:
        if tra_path and os.path.exists(tra_path): os.remove(tra_path)
        if signed_path and os.path.exists(signed_path): os.remove(signed_path)
