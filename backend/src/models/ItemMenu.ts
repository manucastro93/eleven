import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

interface ItemMenuAttributes {
  id: number;
  nombre: string;
  slug: string;
  activo: boolean;
  orden: number;
  icono?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type ItemMenuCreationAttributes = Optional<ItemMenuAttributes, 'id' | 'orden' | 'activo'>;

export class ItemMenu extends Model<ItemMenuAttributes, ItemMenuCreationAttributes>
  implements ItemMenuAttributes {
  public id!: number;
  public nombre!: string;
  public slug!: string;
  public activo!: boolean;
  public orden!: number;
  public icono?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof ItemMenu {
    ItemMenu.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      orden: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },
      icono: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {
      sequelize,
      modelName: 'ItemMenu',
      tableName: 'ItemsMenu',
      timestamps: true,
      paranoid: true
    });

    // Asigna orden incremental por defecto
    ItemMenu.beforeCreate(async (item) => {
      const ultimo = await ItemMenu.findOne({ order: [['orden', 'DESC']] });
      item.orden = (ultimo?.orden || 0) + 1;
    });

    return ItemMenu;
  }
}
