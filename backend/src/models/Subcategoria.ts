import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

interface SubcategoriaAttributes {
  id: number;
  categoriaId: number;
  nombre: string;
  slug: string;
  descripcion?: string | null;
  orden: number;
  destacada: boolean;
  id_dux?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type SubcategoriaCreationAttributes = Optional<SubcategoriaAttributes, 'id' | 'orden'>;

export class Subcategoria extends Model<SubcategoriaAttributes, SubcategoriaCreationAttributes>
  implements SubcategoriaAttributes {
  public id!: number;
  public categoriaId!: number;
  public nombre!: string;
  public slug!: string;
  public descripcion?: string | null;
  public orden!: number;
  public destacada!: boolean;
  public id_dux?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Subcategoria {
    Subcategoria.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      categoriaId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
      },
      orden: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      destacada: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      id_dux: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      }
    }, {
      sequelize,
      modelName: 'Subcategoria',
      tableName: 'Subcategorias',
      timestamps: true,
      paranoid: true
    });

    Subcategoria.beforeCreate(async (subcat) => {
      const ultima = await Subcategoria.findOne({
        where: { categoriaId: subcat.categoriaId },
        order: [['orden', 'DESC']]
      });
      subcat.orden = (ultima?.orden || 0) + 1;
    });

    return Subcategoria;
  }
}