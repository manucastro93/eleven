import { Request, Response } from 'express';
import * as productoService from '@/services/producto.service';
import { sincronizarProductosDesdeDux } from "@/services/syncProductosDesdeDux.service";

export async function getProductos(req: Request, res: Response) {
  try {
    const { search = "", limit = 20, offset = 0, orderBy = "codigo", orderDir = "ASC", categoriaId } = req.query;

    const result = await productoService.listarProductos({
      search: String(search),
      limit: Number(limit),
      offset: Number(offset),
      orderBy: String(orderBy),
      orderDir: orderDir === "DESC" ? "DESC" : "ASC",
      categoriaId: categoriaId ? Number(categoriaId) : null
    });

    res.json(result);
  }catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error al obtener productos:', error);
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function getProductoPorId(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const producto = await productoService.obtenerProductoPorId(id);
    res.json(producto);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function postProducto(req: Request, res: Response) {
  try {
    const { imagenes, ...data } = req.body;
    const nuevo = await productoService.crearProducto(data, imagenes);
    res.status(201).json(nuevo);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function putProducto(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { imagenes, ...data } = req.body;
    const actualizado = await productoService.actualizarProducto(id, data, imagenes);
    res.json(actualizado);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function deleteImagenProducto(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await productoService.eliminarImagen(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function putOrdenImagenes(req: Request, res: Response) {
  try {
    const productoId = Number(req.params.productoId);
    const ordenIds = req.body; // array de IDs ordenados
    await productoService.ordenarImagenes(productoId, ordenIds);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(400).json({ mensaje: 'Error inesperado', detalle: error });
    }
  }
}

export async function uploadImagenesProducto(req: Request, res: Response) {
  try {
    const productoId = Number(req.params.productoId);
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ mensaje: 'No se subieron imágenes.' });
    }

    const nuevas = await productoService.agregarImagenes(productoId, files);

    res.status(201).json({ imagenes: nuevas });
  } catch (error) {
    console.error("Error al subir imágenes:", error);
    res.status(400).json({ mensaje: 'Error al subir imágenes' });
  }
}

export async function syncProductos(req: Request, res: Response) {
  try {
    const resultado = await sincronizarProductosDesdeDux();
    res.status(200).json({
      mensaje: `Productos sincronizados: ${resultado.creados} creados, ${resultado.actualizados} actualizados`,
    });
  } catch (error) {
    console.error("❌ Error en sincronización de productos:", error);
    res.status(500).json({ mensaje: "Hubo un error al sincronizar los productos." });
  }
}

export async function patchItemsMenuProducto(req: Request, res: Response) {
  try {
    const productoId = Number(req.params.id);
    const { itemsMenuIds } = req.body;

    if (!Array.isArray(itemsMenuIds)) {
      return res.status(400).json({ mensaje: "itemsMenuIds debe ser un array" });
    }

    await productoService.actualizarItemsMenuProducto(productoId, itemsMenuIds);
    res.json({ mensaje: "Ítems de menú actualizados correctamente" });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar ítems de menú", detalle: error });
  }
}