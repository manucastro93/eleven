
import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

interface UsuarioAdminAttributes {
  id: number;
  nombre: string;
  email: string;
  passwordHash: string;
  rolUsuarioId: number;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type UsuarioAdminCreationAttributes = Optional<UsuarioAdminAttributes, 'id'>;

export class UsuarioAdmin extends Model<UsuarioAdminAttributes, UsuarioAdminCreationAttributes>
  implements UsuarioAdminAttributes {
  public id!: number;
  public nombre!: string;
  public email!: string;
  public passwordHash!: string;
  public rolUsuarioId!: number;
  public activo!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof UsuarioAdmin {
    UsuarioAdmin.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      rolUsuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    }, {
      sequelize,
      modelName: 'UsuarioAdmin',
      tableName: 'UsuariosAdmin',
      timestamps: true,
      paranoid: true
    });

    return UsuarioAdmin;
  }
}

export type { UsuarioAdminCreationAttributes };
