
import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

interface EstadoPedidoAttributes {
  id: number;
  nombre: string;
  orden: number;
  estadoEdicion: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type EstadoPedidoCreationAttributes = Optional<EstadoPedidoAttributes, 'id'>;

export class EstadoPedido extends Model<EstadoPedidoAttributes, EstadoPedidoCreationAttributes>
  implements EstadoPedidoAttributes {
  public id!: number;
  public nombre!: string;
  public orden!: number;
  public estadoEdicion!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof EstadoPedido {
    EstadoPedido.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      orden: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      estadoEdicion: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    }, {
      sequelize,
      modelName: 'EstadoPedido',
      tableName: 'EstadosPedido',
      timestamps: true,
      paranoid: true
    });

    return EstadoPedido;
  }
}
