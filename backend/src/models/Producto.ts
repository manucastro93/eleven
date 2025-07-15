import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

interface ProductoAttributes {
  id: number;
  nombre: string;
  descripcion: string;
  codigo: string;
  precio: number;
  stock: number;
  categoriaId: number;
  subcategoriaId?: number;
  imagen: string | null;
  activo: boolean;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type ProductoCreationAttributes = Optional<ProductoAttributes, 'id' | 'imagen' | 'slug'>;

export class Producto extends Model<ProductoAttributes, ProductoCreationAttributes>
  implements ProductoAttributes {
  public id!: number;
  public nombre!: string;
  public descripcion!: string;
  public codigo!: string;
  public precio!: number;
  public stock!: number;
  public categoriaId!: number;
  public subcategoriaId!: number;
  public imagen!: string | null;
  public activo!: boolean;
  public slug!: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Producto {
    Producto.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      codigo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      categoriaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subcategoriaId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      imagen: {
        type: DataTypes.STRING,
        allowNull: true
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    }, {
      sequelize,
      modelName: 'Producto',
      tableName: 'Productos',
      timestamps: true,
      paranoid: true
    });

    return Producto;
  }
}

export { ProductoAttributes, ProductoCreationAttributes };
