
import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

interface LogSesionAttributes {
  id: number;
  sesionAnonimaId: string;
  url: string;
  accion: string;
  tiempoEnPagina: number;
  timestamp: Date;
  referrer: string;
  extraData: object | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type LogSesionCreationAttributes = Optional<LogSesionAttributes, 'id' | 'extraData'>;

export class LogSesion extends Model<LogSesionAttributes, LogSesionCreationAttributes>
  implements LogSesionAttributes {
  public id!: number;
  public sesionAnonimaId!: string;
  public url!: string;
  public accion!: string;
  public tiempoEnPagina!: number;
  public timestamp!: Date;
  public referrer!: string;
  public extraData!: object | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof LogSesion {
    LogSesion.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      sesionAnonimaId: {
        type: DataTypes.CHAR(36),
        allowNull: false
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      accion: {
        type: DataTypes.STRING,
        allowNull: false
      },
      tiempoEnPagina: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false
      },
      referrer: {
        type: DataTypes.STRING,
        allowNull: false
      },
      extraData: {
        type: DataTypes.JSON,
        allowNull: true
      }
    }, {
      sequelize,
      modelName: 'LogSesion',
      tableName: 'LogsSesion',
      timestamps: true,
      paranoid: true
    });

    return LogSesion;
  }
}
