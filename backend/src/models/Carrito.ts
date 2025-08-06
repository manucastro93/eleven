import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface CarritoAttributes {
  id: number;
  clienteId: number | null;
  sesionAnonimaId: string | null;
  total: number;
  observaciones?: string;
  estadoEdicion: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type CarritoCreationAttributes = Optional<CarritoAttributes, 'id' | 'observaciones' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export class Carrito extends Model<CarritoAttributes, CarritoCreationAttributes> implements CarritoAttributes {
  public id!: number;
  public clienteId!: number;
  public sesionAnonimaId!: string | null;
  public total!: number;
  public observaciones?: string;
  public estadoEdicion!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Carrito {
    Carrito.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      clienteId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      sesionAnonimaId: {
        type: DataTypes.UUID,
        allowNull: true
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      estadoEdicion: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE
    }, {
      sequelize,
      modelName: 'Carrito',
      tableName: 'Carritos',
      timestamps: true,
      paranoid: true
    });

    return Carrito;
  }
}