import { DataTypes, Model, Sequelize, Optional } from 'sequelize';
import { Local } from './Local';

interface PedidoAttributes {
  id: number;
  clienteId: number;
  estadoPedidoId: number;
  total: number;
  observaciones?: string | null;
  estadoEdicion: boolean;
  fechaEdicion?: Date | null;
  formaEnvio: string;
  transporte?: string;
  formaPago: string;
  telefono: string;
  email: string;
  nombreFantasia: string;
  cuit: string;
  categoriaFiscal: string;
  razonSocial: string;
  direccion: string;
  localidad: string;
  provincia: string;
  codigoPostal: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type PedidoCreationAttributes = Optional<PedidoAttributes, 'id' | 'observaciones' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export class Pedido
  extends Model<PedidoAttributes, PedidoCreationAttributes>
  implements PedidoAttributes
{
  public id!: number;
  public clienteId!: number;
  public ipId!: number;
  public estadoPedidoId!: number;
  public total!: number;
  public observaciones?: string | null;
  public estadoEdicion!: boolean;
  public fechaEdicion?: Date | null;
  public formaEnvio!: string;
  public transporte?: string;
  public formaPago!: string;
  public telefono!: string;
  public email!: string;
  public nombreFantasia!: string;
  public cuit!: string;
  public categoriaFiscal!: string;
  public razonSocial!: string;
  public direccion!: string;
  public localidad!: string;
  public provincia!: string;
  public codigoPostal!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Pedido {
    Pedido.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        clienteId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        estadoPedidoId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        total: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        observaciones: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        estadoEdicion: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        fechaEdicion: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        transporte: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        formaPago: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        formaEnvio: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        telefono: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        nombreFantasia: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        cuit: {
          type: DataTypes.STRING(15),
          allowNull: false,
        },
        categoriaFiscal: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        razonSocial: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        direccion: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        localidad: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        provincia: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        codigoPostal: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
      },
      {
        sequelize,
        modelName: 'Pedido',
        tableName: 'Pedidos',
        timestamps: true,
        paranoid: true
      }
    );

    return Pedido;
  }
}
