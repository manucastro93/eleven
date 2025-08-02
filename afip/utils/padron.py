import requests
from lxml import etree
import traceback
import os
from afip.utils.auth import cargar_ta

# Configuración de directorios
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DEBUG_DIR = os.path.join(BASE_DIR, "debug")
os.makedirs(DEBUG_DIR, exist_ok=True)

def consultar_padron(cuit: str):
    try:
        token, sign = cargar_ta()

        soap = f"""<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Header/>
  <soapenv:Body>
    <getPersona_v2 xmlns="http://ws.server.puc.sr/">
      <token xmlns="">{token}</token>
      <sign xmlns="">{sign}</sign>
      <cuitRepresentada xmlns="">30587607677</cuitRepresentada>
      <idPersona xmlns="">{cuit}</idPersona>
    </getPersona_v2>
  </soapenv:Body>
</soapenv:Envelope>"""

        headers = {
            "Content-Type": "text/xml; charset=UTF-8",
            "SOAPAction": ""
        }

        with open(os.path.join(DEBUG_DIR, "debug_padron_request.xml"), "w", encoding="utf-8") as f:
            f.write(soap)

        res = requests.post(
            "https://aws.afip.gov.ar/sr-padron/webservices/personaServiceA5",
            headers=headers,
            data=soap.encode("utf-8")
        )

        if res.status_code != 200:
            with open(os.path.join(DEBUG_DIR, "debug_padron_response.html"), "w", encoding="utf-8") as f:
                f.write(res.text)
            return {"status": res.status_code, "error": "AFIP Padron error", "body": res.text}

        tree = etree.fromstring(res.content)

        persona_return = tree.find(".//*[local-name()='personaReturn']")
        if persona_return is None:
            return {"error": "No se encontró personaReturn", "raw": res.text}

        print("DEBUG personaReturn:")
        print(etree.tostring(persona_return, pretty_print=True, encoding="unicode"))

        def get_text(xpath_expr):
            el = persona_return.xpath(xpath_expr)
            return el[0].text.strip() if el and el[0].text else None

        def get_impuestos():
            return [e.text for e in persona_return.xpath(".//impuesto/descripcionImpuesto") if e.text]

        def inferir_responsable(impuestos):
            impuestos_str = " ".join(impuestos).upper()
            if "MONOTRIBUTO" in impuestos_str or "MONOTRIBUTISTA" in impuestos_str:
                return "MONOTRIBUTISTA"
            if "IVA" in impuestos_str and "EXENTO" not in impuestos_str:
                return "RESPONSABLE_INSCRIPTO"
            if "IVA EXENTO" in impuestos_str:
                return "EXENTO"
            return "CONSUMIDOR_FINAL"

        impuestos = get_impuestos()
        tipo_persona = get_text(".//datosGenerales/tipoPersona")
        es_juridica = tipo_persona == "JURIDICA"

        return {
            "cuit": get_text(".//idPersona"),
            "tipoPersona": tipo_persona,
            "nombre": (
                get_text(".//datosGenerales/razonSocial")
                if es_juridica else
                f"{get_text('.//datosGenerales/apellido') or ''} {get_text('.//datosGenerales/nombre') or ''}".strip()
            ),
            "estado": get_text(".//datosGenerales/estadoClave"),
            "tipoResponsable": inferir_responsable(impuestos),
            "categoria": get_text(".//categoriaAutonomo/descripcionCategoria") if not es_juridica else None,
            "actividadPrincipal": get_text(".//actividad[1]/descripcionActividad"),
            "domicilioFiscal": {
                "direccion": get_text(".//domicilioFiscal/direccion"),
                "codPostal": get_text(".//domicilioFiscal/codPostal"),
                "localidad": get_text(".//domicilioFiscal/localidad"),
                "provincia": {
                    "id": get_text(".//domicilioFiscal/idProvincia"),
                    "nombre": get_text(".//domicilioFiscal/descripcionProvincia")
                }
            }
        }

    except Exception as e:
        return {
            "error": str(e) or "Error desconocido",
            "traceback": traceback.format_exc()
        }
