import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

interface LocalAttributes {
  id: number;
  nombre: string;
  direccion?: string | null;
  clienteId?: number | null;
  activo: boolean;
}

export type LocalCreationAttributes = Optional<LocalAttributes, 'id' | 'direccion' | 'clienteId'>;

export class Local extends Model<LocalAttributes, LocalCreationAttributes>
  implements LocalAttributes {
  public id!: number;
  public nombre!: string;
  public direccion!: string | null;
  public clienteId!: number | null;
  public activo!: boolean;

  static initModel(sequelize: Sequelize): typeof Local {
    Local.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: true
      },
      clienteId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      sequelize,
      tableName: 'Locales',
      modelName: 'Local',
      timestamps: true,
      paranoid: true
    });

    return Local;
  }
}
