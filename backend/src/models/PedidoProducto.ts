import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

interface PedidoProductoAttributes {
  pedidoId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  observaciones?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type PedidoProductoCreationAttributes = Optional<
  PedidoProductoAttributes,
  'observaciones' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export class PedidoProducto
  extends Model<PedidoProductoAttributes, PedidoProductoCreationAttributes>
  implements PedidoProductoAttributes
{
  public pedidoId!: number;
  public productoId!: number;
  public cantidad!: number;
  public precioUnitario!: number;
  public observaciones?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof PedidoProducto {
    PedidoProducto.init(
      {
        pedidoId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          primaryKey: true
        },
        productoId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          primaryKey: true
        },
        cantidad: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false
        },
        precioUnitario: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false
        },
        observaciones: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
      },
      {
        sequelize,
        modelName: 'PedidoProducto',
        tableName: 'PedidosProductos',
        timestamps: true,
        paranoid: true,
        indexes: [
          { fields: ['pedidoId'] },
          { fields: ['productoId'] }
        ]
      }
    );

    return PedidoProducto;
  }
}
