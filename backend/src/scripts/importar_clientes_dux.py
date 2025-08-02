import asyncio
import os
from pathlib import Path
from datetime import datetime
import pandas as pd
from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.dialects.mysql import insert as mysql_insert
import unicodedata
from dotenv import load_dotenv
from playwright.async_api import async_playwright

# 📦 Cargar variables de entorno
load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / ".env")
USUARIO = os.getenv("DUX_USER", "")
CONTRASENA = os.getenv("DUX_PASS", "")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME")
DB_DIALECT = os.getenv("DB_DIALECT", "mysql")

DATABASE_URL = f"{DB_DIALECT}+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

async def run():
    download_dir = Path(__file__).parent / "descargas"
    download_dir.mkdir(exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(accept_downloads=True)
        page = await context.new_page()

        print("🔐 Iniciando sesión...")
        await page.goto("https://erp.duxsoftware.com.ar")
        await page.wait_for_timeout(500)
        await page.fill('input[name="formLogin:inputUsuario"]', USUARIO)
        await page.fill('input[name="formLogin:inputPassword"]', CONTRASENA)
        await page.click('#formLogin\\:btnLoginBlock')

        #print("⏳ Esperando selector visual de sucursal...")
        #await page.wait_for_selector('#formInicio\\:j_idt900_label', timeout=15000)
        #await page.click('#formInicio\\:j_idt900_label')
        #await page.click('li[id="formInicio:j_idt900_0"]')
        #await page.wait_for_selector('#formInicio\\:j_idt905_label', timeout=10000)
        #await page.click('#formInicio\\:j_idt905_label')
        #await page.click('li[id="formInicio:j_idt905_0"]')

        #print("🟢 Ingresando al sistema...")
        #await page.click('#formInicio\\:j_idt910')
        #await page.wait_for_load_state('networkidle')
        #await page.wait_for_timeout(500)

        print("📊 Menú DATA Y ANALÍTICAS → BASE DATOS → Clientes...")
        await page.click('text=DATA Y ANALITICAS')
        await page.wait_for_timeout(300)
        await page.click('text=BASE DATOS')
        await page.wait_for_timeout(300)
        await page.click('text=Clientes')
        await page.wait_for_url('**/listaClienteBeta.faces')
        await page.wait_for_load_state('networkidle')
        await page.wait_for_timeout(500)

        print("🧩 Menú Acciones → Exportar...")
        await page.wait_for_selector('#formCabecera\\:idAcciones', timeout=10000)
        await page.click('#formCabecera\\:idAcciones')
        await page.wait_for_timeout(300)
        await page.click('text=Exportar')
        await page.wait_for_timeout(500)

        print("⬇️ Esperando ícono de descarga en ventana de exportaciones...")
        await page.wait_for_selector('#ventana_descargas', timeout=15000)
        descargas = await page.query_selector_all('.btn-descarga')
        if not descargas:
            print("❌ No se encontró ninguna exportación disponible para descargar")
            return

        print("💾 Haciendo clic en ícono de descarga (interceptando archivo)...")
        async with page.expect_download() as download_info:
            await descargas[0].click()

        download = await download_info.value

        hoy = datetime.now().strftime("%Y-%m-%d")
        xls_original = Path(__file__).parent / "descargas" / f"clientes_dux_{hoy}.xls"
        await download.save_as(xls_original)

        xls_sanitizado = Path(__file__).parent / "descargas" / "temp_clientes_dux.xls"
        xls_original.rename(xls_sanitizado)

        print(f"✅ Archivo descargado correctamente: {xls_sanitizado}")
        xlsx_path = convertir_a_xlsx(xls_sanitizado)
        procesar_excel(xlsx_path)
        guardar_log("✅ Importación exitosa")

def convertir_a_xlsx(path_xls: Path) -> Path:
    print(f"🔁 Convirtiendo {path_xls.name} a .xlsx...")
    from openpyxl import Workbook

    df = pd.read_excel(path_xls, header=2, engine="xlrd", sheet_name=0)
    columnas_limpias = []
    for c in df.columns:
        nombre = str(c).encode("ascii", "ignore").decode(errors="ignore")
        nombre = nombre.replace("\x1e", "").replace("\n", " ").replace("\r", "").strip()
        columnas_limpias.append(nombre if nombre else "columna_sin_nombre")
    df.columns = columnas_limpias

    wb = Workbook()
    ws = wb.active
    ws.title = "ClientesDux"
    ws.append(df.columns.tolist())
    for row in df.itertuples(index=False, name=None):
        row_limpia = [(v.encode("utf-8", "ignore").decode(errors="ignore").replace("\x1e", "") if isinstance(v, str) else v) for v in row]
        ws.append(row_limpia)

    path_xlsx = path_xls.with_suffix(".xlsx")
    wb.save(path_xlsx)
    print(f"✅ Archivo convertido: {path_xlsx.name}")
    path_xls.unlink(missing_ok=True)
    return path_xlsx

def procesar_excel(ruta_archivo):
    print(f"📖 Leyendo Excel con encabezado: {ruta_archivo}")
    df = pd.read_excel(ruta_archivo)
    print("🧪 Primeras filas:")
    print(df.head())
    print("Columnas detectadas (raw):", df.columns.tolist())

    # Normaliza todas las columnas
    df.columns = [normalizar_nombre_columna(c) for c in df.columns]
    print("Columnas normalizadas:", df.columns.tolist())

    # Pegá este array cada vez que cambie el Excel:
    orden_cols = [
        "ID", "FechaCreacin", "Cliente", "CategoriaFiscal", "TipoDocumento", "NmeroDocumento",
        "CUIT/CUIL", "Cobrador", "TipoCliente", "PersonaContacto", "Noeditable",
        "LugarEntregaporDefecto", "TipoComprobanteporDefecto", "ListaPrecioPorDefecto",
        "Habilitado", "NombredeFantasa", "Cdigo", "CorreoElectrnico", "Vendedor",
        "Provincia", "Localidad", "Barrio", "Domicilio", "Telfono", "Celular", "Zona", "CondicinPago"
    ]

    # Mapping limpio para tu modelo de base:
    df = df.rename(columns={
        "ID": "id",
        "FechaCreacin": "fechaCreacion",
        "Cliente": "cliente",
        "CategoriaFiscal": "categoriaFiscal",
        "TipoDocumento": "tipoDocumento",
        "NmeroDocumento": "numeroDocumento",
        "CUIT/CUIL": "cuitCuil",
        "Cobrador": "cobrador",
        "TipoCliente": "tipoCliente",
        "PersonaContacto": "personaContacto",
        "Noeditable": "noEditable",
        "LugarEntregaporDefecto": "lugarEntregaPorDefecto",
        "TipoComprobanteporDefecto": "tipoComprobantePorDefecto",
        "ListaPrecioPorDefecto": "listaPrecioPorDefecto",
        "Habilitado": "habilitado",
        "NombredeFantasa": "nombreFantasia",
        "Cdigo": "codigo",
        "CorreoElectrnico": "correoElectronico",
        "Vendedor": "vendedor",
        "Provincia": "provincia",
        "Localidad": "localidad",
        "Barrio": "barrio",
        "Domicilio": "domicilio",
        "Telfono": "telefono",
        "Celular": "celular",
        "Zona": "zona",
        "CondicinPago": "condicionPago"
    })

    # Ahora quedate solo con los campos a insertar:
    df = df[[ 
        "id", "fechaCreacion", "cliente", "categoriaFiscal", "tipoDocumento", "numeroDocumento",
        "cuitCuil", "cobrador", "tipoCliente", "personaContacto", "noEditable",
        "lugarEntregaPorDefecto", "tipoComprobantePorDefecto", "listaPrecioPorDefecto",
        "habilitado", "nombreFantasia", "codigo", "correoElectronico", "vendedor",
        "provincia", "localidad", "barrio", "domicilio", "telefono", "celular", "zona", "condicionPago"
    ]]

    df['fechaCreacion'] = pd.to_datetime(df['fechaCreacion'], format="%d/%m/%Y", errors="coerce")
    df["habilitado"] = df["habilitado"].map(lambda x: 1 if str(x).strip().upper() == "S" else 0)
    
    print("Cantidad de filas a insertar:", len(df))
    print("Primeros 5 IDs:", df["id"].head())
    print("DataFrame columns:", df.columns.tolist())

    print("🛠 Insertando con ON DUPLICATE KEY UPDATE...")
    from sqlalchemy import create_engine, MetaData, Table
    from sqlalchemy.dialects.mysql import insert as mysql_insert

    engine = create_engine(DATABASE_URL)
    metadata = MetaData()
    clientes_table = Table("ClientesDux", metadata, autoload_with=engine)

    with engine.begin() as conn:
        count_insertados = 0
        count_errores = 0
        for idx, row in df.iterrows():
            row_data = row.where(pd.notnull(row), None).to_dict()
            try:
                insert_stmt = mysql_insert(clientes_table).values(row_data)
                update_stmt = insert_stmt.on_duplicate_key_update({
                    k: insert_stmt.inserted[k] for k in row_data.keys() if k != 'id'
                })
                result = conn.execute(update_stmt)
                # LOG: mostrar ID y si afectó filas
                print(f"[{idx}] ID={row_data.get('id')} - Filas afectadas: {result.rowcount}")
                if result.rowcount > 0:
                    count_insertados += 1
            except Exception as e:
                print(f"❌ Error fila ID={row_data.get('id')}: {e}")
                count_errores += 1
        print(f"Total insertados/actualizados: {count_insertados}")
        print(f"Total errores: {count_errores}")

    print("✅ Clientes importados (actualizados si existían)")

def guardar_log(mensaje: str):
    with open(Path(__file__).parent / "import_log.txt", "a") as f:
        f.write(f"[{datetime.now().isoformat()}] {mensaje}\n")

def normalizar_nombre_columna(col):
    col = str(col)
    # Elimina acentos y espacios
    col = ''.join(
        c for c in unicodedata.normalize('NFD', col)
        if unicodedata.category(c) != 'Mn'
    )
    col = col.replace("  ", " ").replace(" ", "")
    return col.strip()


if __name__ == "__main__":
    try:
        asyncio.run(run())
    except Exception as e:
        print(f"❌ Error durante la ejecución: {e}")
        guardar_log(f"❌ Error: {e}")
