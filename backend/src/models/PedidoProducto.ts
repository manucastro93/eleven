
import {
  Model, DataTypes, Sequelize
} from 'sequelize';

export class PedidoProducto extends Model {
  static initModel(sequelize: Sequelize): typeof PedidoProducto {
    PedidoProducto.init({
      pedidoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      productoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      precioUnitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      sequelize,
      modelName: 'PedidoProducto',
      tableName: 'PedidosProductos',
      timestamps: true,
      paranoid: true
    });

    return PedidoProducto;
  }
}
