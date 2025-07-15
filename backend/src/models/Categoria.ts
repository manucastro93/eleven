import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

interface CategoriaAttributes {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string;
  orden: number;
  destacada: boolean;
  imagenUrl?: string;
  id_dux?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type CategoriaCreationAttributes = Optional<CategoriaAttributes, 'id' | 'orden'>;

export class Categoria extends Model<CategoriaAttributes, CategoriaCreationAttributes>
  implements CategoriaAttributes {
  public id!: number;
  public nombre!: string;
  public slug!: string;
  public descripcion!: string;
  public orden!: number;
  public destacada!: boolean;
  public imagenUrl?: string;
  public id_dux?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Categoria {
    Categoria.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
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
        allowNull: false
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
      imagenUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: null
      },
      id_dux: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        unique: true
      }
    }, {
      sequelize,
      modelName: 'Categoria',
      tableName: 'Categorias',
      timestamps: true,
      paranoid: true
    });

    Categoria.beforeCreate(async (categoria) => {
      const ultima = await Categoria.findOne({ order: [['orden', 'DESC']] });
      categoria.orden = (ultima?.orden || 0) + 1;
    });

    return Categoria;
  }
}
