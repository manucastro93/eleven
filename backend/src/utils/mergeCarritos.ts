import { Carrito } from '@/models/Carrito';
import { CarritoProducto } from '@/models/CarritoProducto';
import { sequelize } from '@/config/db';
import { Op } from 'sequelize';

export async function mergearCarritosClienteYAnonimo(clienteId: number, sesionAnonimaId: string) {
  const t = await sequelize.transaction();
  try {
    // 1. Traer ambos carritos activos
    const carritoCliente = await Carrito.findOne({
      where: { clienteId, estadoEdicion: 1 },
      transaction: t
    });

    const carritoAnonimo = await Carrito.findOne({
      where: { sesionAnonimaId, clienteId: { [Op.is]: null }, estadoEdicion: 1 },
      transaction: t
    });

    if (!carritoAnonimo && !carritoCliente) {
      // Nada que mergear
      await t.commit();
      return { message: 'No hay carritos activos para mergear.' };
    }

    if (!carritoAnonimo && carritoCliente) {
      // Solo hay carrito de cliente, nada que hacer
      await t.commit();
      return { carritoId: carritoCliente.id, message: 'Ya tenías un carrito activo.' };
    }

    if (carritoAnonimo && !carritoCliente) {
      // Solo hay carrito anónimo, simplemente lo asigno al cliente
      await carritoAnonimo.update({ clienteId }, { transaction: t });
      await t.commit();
      return { carritoId: carritoAnonimo.id, message: 'Carrito anónimo asignado al cliente.' };
    }

    // Si llegamos acá, hay que mergear
    // 2. Traer productos de ambos
    const productosCliente = await CarritoProducto.findAll({
      where: { carritoId: carritoCliente!.id },
      transaction: t
    });
    const productosAnonimo = await CarritoProducto.findAll({
      where: { carritoId: carritoAnonimo!.id },
      transaction: t
    });

    // 3. Generar map productoId -> detalle (para sumar cantidades)
    const mapCliente = new Map<number, typeof productosCliente[0]>();
    productosCliente.forEach(prod => mapCliente.set(prod.productoId, prod));

    let total = 0;

    // 4. Merge real
    for (const prodAnon of productosAnonimo) {
      const prodCliente = mapCliente.get(prodAnon.productoId);
      if (prodCliente) {
        // Suma cantidad (puede ajustar el precio si querés)
        const nuevaCantidad = prodCliente.cantidad + prodAnon.cantidad;
        await prodCliente.update(
          { cantidad: nuevaCantidad },
          { transaction: t }
        );
        total += Number(nuevaCantidad) * Number(prodCliente.precioUnitario);
      } else {
        // Producto nuevo, migrá el detalle al carrito de cliente
        await CarritoProducto.create(
          {
            carritoId: carritoCliente!.id,
            productoId: prodAnon.productoId,
            cantidad: prodAnon.cantidad,
            precioUnitario: prodAnon.precioUnitario,
            observaciones: prodAnon.observaciones
          },
          { transaction: t }
        );
        total += Number(prodAnon.cantidad) * Number(prodAnon.precioUnitario);
      }
    }

    // Sumá los productos originales del carrito cliente (si no los pisaste antes)
    for (const prodCliente of productosCliente) {
      if (!productosAnonimo.find(p => p.productoId === prodCliente.productoId)) {
        total += Number(prodCliente.cantidad) * Number(prodCliente.precioUnitario);
      }
    }

    // 5. Actualizá el total
    await carritoCliente!.update({ total }, { transaction: t });

    // 6. Eliminá el carrito anónimo
    await carritoAnonimo!.destroy({ transaction: t });

    await t.commit();
    return { carritoId: carritoCliente!.id, message: 'Carritos mergeados exitosamente.' };
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

