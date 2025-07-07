
import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

interface IPAttributes {
  id: number;
  clienteId: number;
  direccion: string;
  pais: string;
  region: string;
  ciudad: string;
  isp: string;
  latitud: number | null;
  longitud: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type IPCreationAttributes = Optional<IPAttributes, 'id' | 'latitud' | 'longitud'>;

export class IP extends Model<IPAttributes, IPCreationAttributes>
  implements IPAttributes {
  public id!: number;
  public clienteId!: number;
  public direccion!: string;
  public pais!: string;
  public region!: string;
  public ciudad!: string;
  public isp!: string;
  public latitud!: number | null;
  public longitud!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof IP {
    IP.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      clienteId: {
          type: DataTypes.INTEGER,
          allowNull: false,
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: false
      },
      pais: {
        type: DataTypes.STRING,
        allowNull: false
      },
      region: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ciudad: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isp: {
        type: DataTypes.STRING,
        allowNull: false
      },
      latitud: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true
      },
      longitud: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true
      }
    }, {
      sequelize,
      modelName: 'IP',
      tableName: 'IPs',
      timestamps: true,
      paranoid: true
    });

    return IP;
  }
}
