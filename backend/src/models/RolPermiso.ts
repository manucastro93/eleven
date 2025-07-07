
import {
  Model, DataTypes, Sequelize
} from 'sequelize';

export class RolPermiso extends Model {
  static initModel(sequelize: Sequelize): typeof RolPermiso {
    RolPermiso.init({
      rolUsuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      permisoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      }
    }, {
      sequelize,
      modelName: 'RolPermiso',
      tableName: 'RolesPermisos',
      timestamps: true,
      paranoid: true
    });

    return RolPermiso;
  }
}
