import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface ClienteAttributes {
  id: number;
  clienteDuxId?: number | null;
  nombre: string | null;
  razonSocial: string | null;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  localidad: string | null;
  provincia: string | null;
  codigoPostal: string | null;
  cuitOCuil: string | null;
  categoriaFiscal: string | null;
  latitud: number | null;
  longitud: number | null;
  formaEnvio?: string;
  transporte?: string;
  formaPago?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type ClienteCreationAttributes = Optional<
  ClienteAttributes,
  'id' | 'razonSocial' | 'latitud' | 'longitud' | 'clienteDuxId' // y todos los campos menos 'id'
>;

export class Cliente
  extends Model<ClienteAttributes, ClienteCreationAttributes>
  implements ClienteAttributes
{
  public id!: number;
  public clienteDuxId!: number | null;
  public nombre!: string | null;
  public razonSocial!: string | null;
  public email!: string | null;
  public telefono!: string | null;
  public direccion!: string | null;
  public localidad!: string | null;
  public provincia!: string | null;
  public codigoPostal!: string | null;
  public cuitOCuil!: string | null;
  public categoriaFiscal!: string | null;
  public latitud!: number | null;
  public longitud!: number | null;
  public formaEnvio?: string;
  public transporte?: string;
  public formaPago?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;


  static initModel(sequelize: Sequelize): typeof Cliente {
    Cliente.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        clienteDuxId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
          references: {
            model: 'ClientesDux',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        nombre: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        razonSocial: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        telefono: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        direccion: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        localidad: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        codigoPostal: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        provincia: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        cuitOCuil: {
          type: DataTypes.STRING(15),
          allowNull: true,
          unique: true,
        },
        categoriaFiscal: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        latitud: {
          type: DataTypes.DECIMAL(9, 6),
          allowNull: true,
        },
        longitud: {
          type: DataTypes.DECIMAL(9, 6),
          allowNull: true,
        },
        transporte: {
          type: DataTypes.TEXT(),
          allowNull: true,
        },
        formaPago: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        formaEnvio: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
      },
      {
        sequelize,
        modelName: 'Cliente',
        tableName: 'Clientes',
        timestamps: true,
        paranoid: true,
      }
    );
    return Cliente;
  }
}
