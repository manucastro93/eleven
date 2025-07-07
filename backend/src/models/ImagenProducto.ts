
import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

interface ImagenProductoAttributes {
  id: number;
  productoId: number;
  url: string;
  orden: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type ImagenProductoCreationAttributes = Optional<ImagenProductoAttributes, 'id'>;

export class ImagenProducto extends Model<ImagenProductoAttributes, ImagenProductoCreationAttributes>
  implements ImagenProductoAttributes {
  public id!: number;
  public productoId!: number;
  public url!: string;
  public orden!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof ImagenProducto {
    ImagenProducto.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      productoId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      orden: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    }, {
      sequelize,
      modelName: 'ImagenProducto',
      tableName: 'ImagenesProducto',
      timestamps: true,
      paranoid: true
    });

    return ImagenProducto;
  }
}
