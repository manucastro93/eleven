
import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

interface HistorialClienteAttributes {
  id: number;
  clienteId: number;
  datosAntes: object;
  datosDespues: object;
  ipId: number | null;
  origen: string;
  usuarioId: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type HistorialClienteCreationAttributes = Optional<HistorialClienteAttributes, 'id' | 'ipId' | 'usuarioId'>;

export class HistorialCliente extends Model<HistorialClienteAttributes, HistorialClienteCreationAttributes>
  implements HistorialClienteAttributes {
  public id!: number;
  public clienteId!: number;
  public datosAntes!: object;
  public datosDespues!: object;
  public ipId!: number | null;
  public origen!: string;
  public usuarioId!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof HistorialCliente {
    HistorialCliente.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      clienteId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      datosAntes: {
        type: DataTypes.JSON,
        allowNull: false
      },
      datosDespues: {
        type: DataTypes.JSON,
        allowNull: false
      },
      ipId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      origen: {
        type: DataTypes.STRING,
        allowNull: false
      },
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    }, {
      sequelize,
      modelName: 'HistorialCliente',
      tableName: 'HistorialClientes',
      timestamps: true,
      paranoid: true
    });

    return HistorialCliente;
  }
}
