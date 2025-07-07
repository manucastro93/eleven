import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface HistorialEstadoPedidoAttributes {
  id: number;
  pedidoId: number;
  estadoPedidoId: number;
  fechaHoraCambio: Date;
}

export type HistorialEstadoPedidoCreationAttributes = Optional<HistorialEstadoPedidoAttributes, 'id'>;

export class HistorialEstadoPedido
  extends Model<HistorialEstadoPedidoAttributes, HistorialEstadoPedidoCreationAttributes>
  implements HistorialEstadoPedidoAttributes
{
  public id!: number;
  public pedidoId!: number;
  public estadoPedidoId!: number;
  public fechaHoraCambio!: Date;

  static initModel(sequelize: Sequelize): typeof HistorialEstadoPedido {
    HistorialEstadoPedido.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        pedidoId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        estadoPedidoId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        fechaHoraCambio: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: 'HistorialEstadoPedido',
        tableName: 'HistorialEstadosPedidos',
        timestamps: true,
        paranoid: false,
      }
    );
    return HistorialEstadoPedido;
  }
}
