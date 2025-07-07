
import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

interface MetodoPagoAttributes {
  id: number;
  nombre: string;
  detalle: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type MetodoPagoCreationAttributes = Optional<MetodoPagoAttributes, 'id'>;

export class MetodoPago extends Model<MetodoPagoAttributes, MetodoPagoCreationAttributes>
  implements MetodoPagoAttributes {
  public id!: number;
  public nombre!: string;
  public detalle!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof MetodoPago {
    MetodoPago.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      detalle: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {
      sequelize,
      modelName: 'MetodoPago',
      tableName: 'MetodosPago',
      timestamps: true,
      paranoid: true
    });

    return MetodoPago;
  }
}
