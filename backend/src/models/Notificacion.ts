import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface NotificacionAttributes {
  id: number;
  titulo: string;
  mensaje: string;
  leida: boolean;
  usuarioId?: number | null;
}

type NotificacionCreationAttributes = Optional<NotificacionAttributes, 'id' | 'leida' | 'usuarioId'>;

export class Notificacion extends Model<NotificacionAttributes, NotificacionCreationAttributes>
  implements NotificacionAttributes {
  public id!: number;
  public titulo!: string;
  public mensaje!: string;
  public leida!: boolean;
  public usuarioId!: number | null;

  static initModel(sequelize: Sequelize): typeof Notificacion {
    Notificacion.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      titulo: {
        type: DataTypes.STRING,
        allowNull: false
      },
      mensaje: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      leida: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    }, {
      sequelize,
      tableName: 'notificaciones',
      modelName: 'Notificacion',
      timestamps: true,
      paranoid: true
    });

    return Notificacion;
  }
}
