import os
import asyncio
from pathlib import Path
from datetime import datetime
import pandas as pd
import unicodedata
from dotenv import load_dotenv
from sqlalchemy import create_engine, MetaData, Table, update
from playwright.async_api import async_playwright

# --- CONFIG Y UTILIDADES ---

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

def normalizar_nombre_columna(col):
    col = str(col)
    col = ''.join(
        c for c in unicodedata.normalize('NFD', col)
        if unicodedata.category(c) != 'Mn'
    )
    col = col.replace("  ", " ").replace(" ", "")
    return col.strip()

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

def procesar_excel_incremental(ruta_archivo, engine, clientes_table):
    print(f"📖 Leyendo Excel con encabezado: {ruta_archivo}")
    df = pd.read_excel(ruta_archivo)
    print("🧪 Primeras filas:")
    print(df.head())
    print("Columnas detectadas (raw):", df.columns.tolist())
    # Normaliza columnas
    df.columns = [normalizar_nombre_columna(c) for c in df.columns]
    print("Columnas normalizadas:", df.columns.tolist())
    orden_cols = [
        "ID", "FechaCreacin", "Cliente", "CategoriaFiscal", "TipoDocumento", "NmeroDocumento",
        "CUIT/CUIL", "Cobrador", "TipoCliente", "PersonaContacto", "Noeditable",
        "LugarEntregaporDefecto", "TipoComprobanteporDefecto", "ListaPrecioPorDefecto",
        "Habilitado", "NombredeFantasa", "Cdigo", "CorreoElectrnico", "Vendedor",
        "Provincia", "Localidad", "Barrio", "Domicilio", "Telfono", "Celular", "Zona", "CondicinPago"
    ]
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
    df = df[[ 
        "id", "fechaCreacion", "cliente", "categoriaFiscal", "tipoDocumento", "numeroDocumento",
        "cuitCuil", "cobrador", "tipoCliente", "personaContacto", "noEditable",
        "lugarEntregaPorDefecto", "tipoComprobantePorDefecto", "listaPrecioPorDefecto",
        "habilitado", "nombreFantasia", "codigo", "correoElectronico", "vendedor",
        "provincia", "localidad", "barrio", "domicilio", "telefono", "celular", "zona", "condicionPago"
    ]]
    # Normaliza tipos
    df['id'] = df['id'].astype(int)
    df['fechaCreacion'] = pd.to_datetime(df['fechaCreacion'], format="%d/%m/%Y", errors="coerce")
    df["habilitado"] = df["habilitado"].map(lambda x: 1 if str(x).strip().upper() == "S" else 0)
    # Trae lo que hay en la base para comparar
    df_db = pd.read_sql("SELECT * FROM ClientesDux", engine)
    df_db['id'] = df_db['id'].astype(int)
    df.set_index('id', inplace=True)
    df_db.set_index('id', inplace=True)
    # Detectar nuevos
    df_nuevos = df.loc[~df.index.isin(df_db.index)].reset_index()
    print(f"🔎 Nuevos clientes a insertar: {len(df_nuevos)}")
    # Detectar modificados (que existen en ambos pero con cambios)
    cols_para_comparar = [c for c in df.columns if c in df_db.columns]
    df_common = df.loc[df.index.isin(df_db.index)][cols_para_comparar]
    df_db_common = df_db.loc[df_db.index.isin(df.index)][cols_para_comparar]
    modificados_mask = (df_common != df_db_common).any(axis=1)
    df_modificados = df_common[modificados_mask].reset_index()
    print(f"🔎 Clientes existentes con cambios: {len(df_modificados)}")
    # INSERT nuevos
    insertados = 0
    with engine.begin() as conn:
        for _, row in df_nuevos.iterrows():
            row_data = row.where(pd.notnull(row), None).to_dict()
            try:
                conn.execute(clientes_table.insert().values(**row_data))
                insertados += 1
            except Exception as e:
                print(f"❌ Error insertando nuevo ID={row_data.get('id')}: {e}")
    # UPDATE modificados
    actualizados = 0
    with engine.begin() as conn:
        for _, row in df_modificados.iterrows():
            row_data = row.where(pd.notnull(row), None).to_dict()
            row_id = row_data.pop('id')
            try:
                stmt = (
                    update(clientes_table)
                    .where(clientes_table.c.id == row_id)
                    .values(**row_data)
                )
                conn.execute(stmt)
                actualizados += 1
            except Exception as e:
                print(f"❌ Error actualizando ID={row_id}: {e}")
    print(f"✅ Total insertados: {insertados}")
    print(f"✅ Total actualizados: {actualizados}")

def guardar_log(mensaje: str):
    with open(Path(__file__).parent / "import_log.txt", "a") as f:
        f.write(f"[{datetime.now().isoformat()}] {mensaje}\n")

# --- FLUJO PRINCIPAL ---

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
        # --- PROCESO INCREMENTAL ---
        engine = create_engine(DATABASE_URL)
        metadata = MetaData()
        clientes_table = Table("ClientesDux", metadata, autoload_with=engine)
        procesar_excel_incremental(xlsx_path, engine, clientes_table)
        guardar_log("✅ Importación exitosa")

if __name__ == "__main__":
    asyncio.run(run())
