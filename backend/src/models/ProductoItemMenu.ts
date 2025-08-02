import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

interface ProductoItemMenuAttributes {
  id: number;
  productoId: number;
  itemMenuId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type ProductoItemMenuCreationAttributes = Optional<ProductoItemMenuAttributes, 'id'>;

export class ProductoItemMenu extends Model<ProductoItemMenuAttributes, ProductoItemMenuCreationAttributes>
  implements ProductoItemMenuAttributes {
  public id!: number;
  public productoId!: number;
  public itemMenuId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof ProductoItemMenu {
    ProductoItemMenu.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      productoId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      itemMenuId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'ProductoItemMenu',
      tableName: 'ProductoItemMenu',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ['productoId', 'itemMenuId'],
        },
      ],
    });

    return ProductoItemMenu;
  }
}

export { ProductoItemMenuAttributes, ProductoItemMenuCreationAttributes };
