
import {
  Model, DataTypes, Sequelize, Optional, BelongsToManyGetAssociationsMixin
} from 'sequelize';

interface RolUsuarioAttributes {
  id: number;
  nombre: string;
  descripcion: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type RolUsuarioCreationAttributes = Optional<RolUsuarioAttributes, 'id'>;

export class RolUsuario extends Model<RolUsuarioAttributes, RolUsuarioCreationAttributes>
  implements RolUsuarioAttributes {
  public id!: number;
  public nombre!: string;
  public descripcion!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  public getPermisos!: BelongsToManyGetAssociationsMixin<import('./Permiso').Permiso>;  

  static initModel(sequelize: Sequelize): typeof RolUsuario {
    RolUsuario.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      descripcion: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'RolUsuario',
      tableName: 'RolesUsuario',
      timestamps: true,
      paranoid: true
    });

    return RolUsuario;
  }
}

export type { RolUsuarioCreationAttributes };

