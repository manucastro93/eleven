import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

interface PedidoDuxAttributes {
  id: number;
  nro_pedido: number;
  id_cliente: number;
  cliente: string;
  id_personal: number;
  personal: string;
  id_empresa: number;
  id_sucursal: number;
  fecha: Date;
  observaciones?: string | null;
  monto_exento: number;
  monto_gravado: number;
  monto_iva: number;
  monto_descuento: number;
  total: number;
  estado_facturacion: string;
  estado_remito: string;
  anulado: boolean;
  id_moneda: number;
  moneda: string;
  cotizacion_moneda: number;
  cotizacion_dolar: number;
  monto_percepcion_impuesto: number;
  ctd_facturada: number;
  ctd_con_remito: number;
  ctd_facturada_con_remito: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type PedidoDuxCreationAttributes = Optional<PedidoDuxAttributes, 'id'>;

export class PedidoDux
  extends Model<PedidoDuxAttributes, PedidoDuxCreationAttributes>
  implements PedidoDuxAttributes
{
  public id!: number;
  public nro_pedido!: number;
  public id_cliente!: number;
  public cliente!: string;
  public id_personal!: number;
  public personal!: string;
  public id_empresa!: number;
  public id_sucursal!: number;
  public fecha!: Date;
  public observaciones?: string | null;
  public monto_exento!: number;
  public monto_gravado!: number;
  public monto_iva!: number;
  public monto_descuento!: number;
  public total!: number;
  public estado_facturacion!: string;
  public estado_remito!: string;
  public anulado!: boolean;
  public id_moneda!: number;
  public moneda!: string;
  public cotizacion_moneda!: number;
  public cotizacion_dolar!: number;
  public monto_percepcion_impuesto!: number;
  public ctd_facturada!: number;
  public ctd_con_remito!: number;
  public ctd_facturada_con_remito!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof PedidoDux {
    PedidoDux.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
        },
        nro_pedido: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        id_cliente: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        cliente: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        id_personal: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        personal: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        id_empresa: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        id_sucursal: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        fecha: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        observaciones: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        monto_exento: {
          type: DataTypes.DECIMAL(15, 4),
          allowNull: false,
        },
        monto_gravado: {
          type: DataTypes.DECIMAL(15, 4),
          allowNull: false,
        },
        monto_iva: {
          type: DataTypes.DECIMAL(15, 4),
          allowNull: false,
        },
        monto_descuento: {
          type: DataTypes.DECIMAL(15, 4),
          allowNull: false,
        },
        total: {
          type: DataTypes.DECIMAL(15, 4),
          allowNull: false,
        },
        estado_facturacion: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        estado_remito: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        anulado: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        id_moneda: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        moneda: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        cotizacion_moneda: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
        },
        cotizacion_dolar: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
        },
        monto_percepcion_impuesto: {
          type: DataTypes.DECIMAL(15, 4),
          allowNull: false,
        },
        ctd_facturada: {
          type: DataTypes.DECIMAL(15, 4),
          allowNull: false,
        },
        ctd_con_remito: {
          type: DataTypes.DECIMAL(15, 4),
          allowNull: false,
        },
        ctd_facturada_con_remito: {
          type: DataTypes.DECIMAL(15, 4),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'PedidoDux',
        tableName: 'PedidosDux',
        timestamps: true,
        paranoid: true
      }
    );

    return PedidoDux;
  }
}
