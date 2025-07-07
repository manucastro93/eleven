import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

interface ClienteAttributes {
  id: number;
  nombre: string;
  razonSocial: string | null;
  email: string;
  telefono: string;
  direccion: string;
  localidad: string;
  provincia: string;
  cuitOCuil: string;
  latitud: number | null;
  longitud: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type ClienteCreationAttributes = Optional<ClienteAttributes, 'id' | 'razonSocial' | 'latitud' | 'longitud'>;

export class Cliente extends Model<ClienteAttributes, ClienteCreationAttributes>
  implements ClienteAttributes {
  public id!: number;
  public nombre!: string;
  public razonSocial!: string | null;
  public email!: string;
  public telefono!: string;
  public direccion!: string;
  public localidad!: string;
  public provincia!: string;
  public cuitOCuil!: string;
  public latitud!: number | null;
  public longitud!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Cliente {
    Cliente.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      razonSocial: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      telefono: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      localidad: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      provincia: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cuitOCuil: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      latitud: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true,
      },
      longitud: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true,
      }
    }, {
      sequelize,
      modelName: 'Cliente',
      tableName: 'Clientes',
      timestamps: true,
      paranoid: true,
    });

    return Cliente;
  }
}
