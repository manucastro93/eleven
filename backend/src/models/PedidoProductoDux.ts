import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

interface PedidoProductoDuxAttributes {
  id: number;
  pedido_dux_id: number;
  cod_item: string;
  item: string;
  descripcion: string;
  ctd: number;
  precio_uni: number;
  porc_desc: number;
  porc_iva: number;
  id_moneda: number;
  moneda: string;
  cotizacion_moneda: number;
  cotizacion_dolar: number;
  ctd_facturada: number;
  ctd_con_remito: number;
  ctd_facturada_con_remito: number;
  ctd_unidad_pesable: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type PedidoProductoDuxCreationAttributes = Optional<PedidoProductoDuxAttributes, 'id'>;

export class PedidoProductoDux
  extends Model<PedidoProductoDuxAttributes, PedidoProductoDuxCreationAttributes>
  implements PedidoProductoDuxAttributes
{
  public id!: number;
  public pedido_dux_id!: number;
  public cod_item!: string;
  public item!: string;
  public descripcion!: string;
  public ctd!: number;
  public precio_uni!: number;
  public porc_desc!: number;
  public porc_iva!: number;
  public id_moneda!: number;
  public moneda!: string;
  public cotizacion_moneda!: number;
  public cotizacion_dolar!: number;
  public ctd_facturada!: number;
  public ctd_con_remito!: number;
  public ctd_facturada_con_remito!: number;
  public ctd_unidad_pesable!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize): typeof PedidoProductoDux {
    PedidoProductoDux.init(
      {
        id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        pedido_dux_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        cod_item: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        item: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        descripcion: {
          type: DataTypes.TEXT,
          allowNull: false,
          defaultValue: '',
        },
        ctd: {
          type: DataTypes.DECIMAL(15, 4),
          allowNull: false,
        },
        precio_uni: {
          type: DataTypes.DECIMAL(15, 4),
          allowNull: false,
        },
        porc_desc: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
        },
        porc_iva: {
          type: DataTypes.DECIMAL(10, 4),
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
        ctd_unidad_pesable: {
          type: DataTypes.DECIMAL(15, 4),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'PedidoProductoDux',
        tableName: 'PedidosProductosDux',
        timestamps: true,
        paranoid: true
      }
    );

    return PedidoProductoDux;
  }
}
