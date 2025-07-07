import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

interface PermisoAttributes {
  id: number;
  rolUsuarioId: number;
  moduloId: number;
  accion: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type PermisoCreationAttributes = Optional<PermisoAttributes, 'id'>;

export class Permiso extends Model<PermisoAttributes, PermisoCreationAttributes>
  implements PermisoAttributes {
  public id!: number;
  public rolUsuarioId!: number;
  public moduloId!: number;
  public accion!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Permiso {
    Permiso.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      rolUsuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      moduloId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      accion: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'Permiso',
      tableName: 'Permisos',
      timestamps: true,
      paranoid: true
    });

    return Permiso;
  }
}
