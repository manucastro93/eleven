import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

interface SesionAnonimaAttributes {
  id: string;
  clienteId: number | null;
  ip: string;
  userAgent: string | null;
  fecha: Date;
  expiracion: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type SesionAnonimaCreationAttributes = Optional<SesionAnonimaAttributes, 'id' | 'clienteId' | 'userAgent' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export class SesionAnonima extends Model<SesionAnonimaAttributes, SesionAnonimaCreationAttributes>
  implements SesionAnonimaAttributes {
  public id!: string;
  public clienteId!: number | null;
  public ip!: string;
  public userAgent!: string | null;
  public fecha!: Date;
  public expiracion!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof SesionAnonima {
    SesionAnonima.init({
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      clienteId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userAgent: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      expiracion: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    }, {
      sequelize,
      modelName: 'SesionAnonima',
      tableName: 'SesionesAnonimas',
      timestamps: true,
      paranoid: true,
    });

    return SesionAnonima;
  }
}
