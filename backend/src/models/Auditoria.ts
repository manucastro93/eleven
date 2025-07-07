
import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

interface AuditoriaAttributes {
  id: number;
  usuarioId: number;
  moduloId: number;
  accion: string;
  recursoId?: number | null;
  datosAntes?: object | null;
  datosDespues?: object | null;
  extraData?: object | null; 
  createdAt?: Date;
  updatedAt?: Date;
}


type AuditoriaCreationAttributes = Optional<AuditoriaAttributes, 'id'>;

export class Auditoria extends Model<AuditoriaAttributes, AuditoriaCreationAttributes>
  implements AuditoriaAttributes {
  public id!: number;
  public usuarioId!: number;
  public moduloId!: number;
  public accion!: string;
  public recursoId!: number;
  public datosAntes!: object;
  public datosDespues!: object;
  public extraData!: object | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Auditoria {
    Auditoria.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      usuarioId: {
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
      },
      recursoId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      datosAntes: {
        type: DataTypes.JSON,
        allowNull: true
      },
      datosDespues: {
        type: DataTypes.JSON,
        allowNull: true
      },
      extraData: {
        type: DataTypes.JSON,
        allowNull: true
      }
    }, {
      sequelize,
      modelName: 'Auditoria',
      tableName: 'Auditorias',
      timestamps: true,
      paranoid: true
    });

    return Auditoria;
  }
}
