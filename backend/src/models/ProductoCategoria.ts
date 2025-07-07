
import {
  Model, DataTypes, Sequelize
} from 'sequelize';

export class ProductoCategoria extends Model {
  static initModel(sequelize: Sequelize): typeof ProductoCategoria {
    ProductoCategoria.init({
      productoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      categoriaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      }
    }, {
      sequelize,
      modelName: 'ProductoCategoria',
      tableName: 'ProductoCategorias',
      timestamps: true,
      paranoid: true
    });

    return ProductoCategoria;
  }
}
