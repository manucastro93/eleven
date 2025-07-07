import { DataTypes, Model, Sequelize, Optional } from 'sequelize';
import { Local } from './Local';

interface PedidoAttributes {
  id: number;
  clienteId: number;
  ipId: number;
  estadoPedidoId: number;
  metodoEnvioId: number;
  metodoPagoId: number;
  localId?: number | null;
  total: number;
  observaciones?: string | null;
  estadoEdicion: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type PedidoCreationAttributes = Optional<PedidoAttributes, 'id' | 'localId'>;

export class Pedido
  extends Model<PedidoAttributes, PedidoCreationAttributes>
  implements PedidoAttributes
{
  public id!: number;
  public clienteId!: number;
  public ipId!: number;
  public estadoPedidoId!: number;
  public metodoEnvioId!: number;
  public metodoPagoId!: number;
  public localId!: number | null;
  public total!: number;
  public observaciones?: string | null;
  public estadoEdicion!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Pedido {
    Pedido.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        clienteId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        ipId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        estadoPedidoId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        metodoEnvioId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        metodoPagoId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        localId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        total: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        observaciones: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        estadoEdicion: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      },
      {
        sequelize,
        modelName: 'Pedido',
        tableName: 'Pedidos',
        timestamps: true,
        paranoid: true,
        defaultScope: {
          include: [{ model: Local, as: 'local' }]
        },
      }
    );

    return Pedido;
  }
}
