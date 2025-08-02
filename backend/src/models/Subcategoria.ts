import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

interface SubcategoriaAttributes {
  id: number;
  id_sub_rubro: number;
  categoriaId: number;
  nombre: string;
  slug: string;
  descripcion?: string | null;
  orden: number;
  destacada: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type SubcategoriaCreationAttributes = Optional<SubcategoriaAttributes, 'id' | 'orden'>;

export class Subcategoria extends Model<SubcategoriaAttributes, SubcategoriaCreationAttributes>
  implements SubcategoriaAttributes {
  public id!: number;
  public id_sub_rubro!: number; // nuevo campo
  public categoriaId!: number;
  public nombre!: string;
  public slug!: string;
  public descripcion?: string | null;
  public orden!: number;
  public destacada!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Subcategoria {
    Subcategoria.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      id_sub_rubro: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
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
      }
    }, {
      sequelize,
      modelName: 'Subcategoria',
      tableName: 'Subcategorias',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'idx_categoria_subrubro',
          unique: true,
          fields: ['categoriaId', 'id_sub_rubro']
        }
      ]
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
