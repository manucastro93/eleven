import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

interface WhatsappVerificacionAttributes {
  id: number;
  numero: string;
  codigo: string;
  estado: 'pendiente' | 'verificado';
  expiracion: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type WhatsappVerificacionCreationAttributes = Optional<WhatsappVerificacionAttributes, 'id' | 'estado'>;

export class WhatsappVerificacion
  extends Model<WhatsappVerificacionAttributes, WhatsappVerificacionCreationAttributes>
  implements WhatsappVerificacionAttributes {
  public id!: number;
  public numero!: string;
  public codigo!: string;
  public estado!: 'pendiente' | 'verificado';
  public expiracion!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof WhatsappVerificacion {
    WhatsappVerificacion.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      numero: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      codigo: {
        type: DataTypes.STRING(3),
        allowNull: false
      },
      estado: {
        type: DataTypes.ENUM('pendiente', 'verificado'),
        allowNull: false,
        defaultValue: 'pendiente'
      },
      expiracion: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'WhatsappVerificacion',
      tableName: 'WhatsappVerificacion',
      timestamps: true,
      paranoid: true
    });

    return WhatsappVerificacion;
  }
}
