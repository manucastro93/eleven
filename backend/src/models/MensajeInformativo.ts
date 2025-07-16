import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

interface MensajeInformativoAttributes {
  id: number;
  mensaje: string;
  activo: boolean;
  orden: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type MensajeInformativoCreationAttributes = Optional<MensajeInformativoAttributes, 'id' | 'orden'>;

export class MensajeInformativo extends Model<MensajeInformativoAttributes, MensajeInformativoCreationAttributes>
  implements MensajeInformativoAttributes {
  public id!: number;
  public mensaje!: string;
  public activo!: boolean;
  public orden!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof MensajeInformativo {
    MensajeInformativo.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      mensaje: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      orden: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    }, {
      sequelize,
      modelName: 'MensajeInformativo',
      tableName: 'MensajesInformativos',
      timestamps: true,
      paranoid: true
    });

    MensajeInformativo.beforeCreate(async (mensaje) => {
      const ultimo = await MensajeInformativo.findOne({ order: [['orden', 'DESC']] });
      mensaje.orden = (ultimo?.orden || 0) + 1;
    });

    return MensajeInformativo;
  }
}
