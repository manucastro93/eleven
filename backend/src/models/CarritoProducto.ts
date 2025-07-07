import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface CarritoProductoAttributes {
  carritoId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  observaciones?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type CarritoProductoCreationAttributes = Optional<CarritoProductoAttributes, 'observaciones' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export class CarritoProducto extends Model<CarritoProductoAttributes, CarritoProductoCreationAttributes> implements CarritoProductoAttributes {
  public carritoId!: number;
  public productoId!: number;
  public cantidad!: number;
  public precioUnitario!: number;
  public observaciones?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof CarritoProducto {
    CarritoProducto.init({
      carritoId: {
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
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE
    }, {
      sequelize,
      modelName: 'CarritoProducto',
      tableName: 'CarritosProductos',
      timestamps: true,
      paranoid: true
    });

    return CarritoProducto;
  }
}