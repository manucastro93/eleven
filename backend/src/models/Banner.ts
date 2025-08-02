import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

// Definimos las propiedades que tendrá el modelo Banner
interface BannerAttributes {
  id: number;
  img: string;
  texto: string;
  botonTexto?: string | null;
  botonLink?: string | null;
  descripcionEstilo?: string | null;
  botonEstilo?: string | null;
  textoTop: number;
  textoLeft: number;
  textoWidth: number;
  botonTop: number;
  botonLeft: number;
  fechaDesde: Date;
  fechaHasta?: Date | null;
  orden: number;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

// Atributos para la creación de un banner
type BannerCreationAttributes = Optional<BannerAttributes,
  'id'
  | 'botonTexto'
  | 'botonLink'
  | 'descripcionEstilo'
  | 'botonEstilo'
  | 'textoTop'
  | 'textoLeft'
  | 'textoWidth'
  | 'botonTop'
  | 'botonLeft'
  | 'fechaHasta'
  | 'orden'
  | 'activo'
>;

export class Banner extends Model<BannerAttributes, BannerCreationAttributes>
  implements BannerAttributes {
  public id!: number;
  public img!: string;
  public texto!: string;
  public botonTexto!: string | null;
  public botonLink!: string | null;
  public descripcionEstilo!: string | null;
  public botonEstilo!: string | null;
  public textoTop!: number;
  public textoLeft!: number;
  public textoWidth!: number;
  public botonTop!: number;
  public botonLeft!: number;
  public fechaDesde!: Date;
  public fechaHasta!: Date | null;
  public orden!: number;
  public activo!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Banner {
    Banner.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      img: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      texto: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      botonTexto: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      botonLink: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      descripcionEstilo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      botonEstilo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      textoTop: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 50,
      },
      textoLeft: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 50,
      },
      textoWidth: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 50,
      },
      botonTop: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 50,
      },
      botonLeft: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 50,
      },
      fechaDesde: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      fechaHasta: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      orden: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      }
    }, {
      sequelize,
      modelName: 'Banner',
      tableName: 'Banners',
      timestamps: true,
      paranoid: true,
    });

    return Banner;
  }
}
