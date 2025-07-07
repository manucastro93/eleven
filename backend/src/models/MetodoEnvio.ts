
import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

interface MetodoEnvioAttributes {
  id: number;
  nombre: string;
  detalle: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type MetodoEnvioCreationAttributes = Optional<MetodoEnvioAttributes, 'id'>;

export class MetodoEnvio extends Model<MetodoEnvioAttributes, MetodoEnvioCreationAttributes>
  implements MetodoEnvioAttributes {
  public id!: number;
  public nombre!: string;
  public detalle!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof MetodoEnvio {
    MetodoEnvio.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      detalle: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {
      sequelize,
      modelName: 'MetodoEnvio',
      tableName: 'MetodosEnvio',
      timestamps: true,
      paranoid: true
    });

    return MetodoEnvio;
  }
}
