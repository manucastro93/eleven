import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

interface ModuloAttributes {
  id: number;
  nombre: string;
  ruta: string | null;
  icono: string | null;
  grupo: string | null;
  orden: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type ModuloCreationAttributes = Optional<ModuloAttributes, 'id'>;

export class Modulo extends Model<ModuloAttributes, ModuloCreationAttributes>
  implements ModuloAttributes {
  public id!: number;
  public nombre!: string;
  public ruta!: string | null;
  public icono!: string | null;
  public grupo!: string | null;
  public orden!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Modulo {
    Modulo.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ruta: {
        type: DataTypes.STRING,
        allowNull: true
      },
      icono: {
        type: DataTypes.STRING,
        allowNull: true
      },
      grupo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      orden: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
    }, {
      sequelize,
      modelName: 'Modulo',
      tableName: 'Modulos',
      timestamps: true,
      paranoid: true
    });

    return Modulo;
  }
}
