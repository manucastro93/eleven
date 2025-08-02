// src/models/ClienteDux.ts
import {
  Model, DataTypes, Sequelize, Optional
} from 'sequelize';

export interface ClienteDuxAttributes {
  id: number;
  fechaCreacion?: Date | null;
  cliente?: string | null;
  categoriaFiscal?: string | null;
  tipoDocumento?: string | null;
  numeroDocumento?: string | null;
  cuitCuil?: string | null;
  cobrador?: string | null;
  tipoCliente?: string | null;
  personaContacto?: string | null;
  noEditable?: boolean | number | null;
  lugarEntregaPorDefecto?: string | null;
  tipoComprobantePorDefecto?: string | null;
  listaPrecioPorDefecto?: string | null;
  habilitado?: boolean | number | null;
  nombreFantasia?: string | null;
  codigo?: string | null;
  correoElectronico?: string | null;
  vendedor?: string | null;
  provincia?: string | null;
  localidad?: string | null;
  barrio?: string | null;
  domicilio?: string | null;
  telefono?: string | null;
  celular?: string | null;
  zona?: string | null;
  condicionPago?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type ClienteDuxCreationAttributes = Optional<
  ClienteDuxAttributes,
  'id'
>;

export class ClienteDux extends Model<ClienteDuxAttributes, ClienteDuxCreationAttributes>
  implements ClienteDuxAttributes {
  public id!: number;
  public fechaCreacion?: Date | null;
  public cliente?: string | null;
  public categoriaFiscal?: string | null;
  public tipoDocumento?: string | null;
  public numeroDocumento?: string | null;
  public cuitCuil?: string | null;
  public cobrador?: string | null;
  public tipoCliente?: string | null;
  public personaContacto?: string | null;
  public noEditable?: boolean | number | null;
  public lugarEntregaPorDefecto?: string | null;
  public tipoComprobantePorDefecto?: string | null;
  public listaPrecioPorDefecto?: string | null;
  public habilitado?: boolean | number | null;
  public nombreFantasia?: string | null;
  public codigo?: string | null;
  public correoElectronico?: string | null;
  public vendedor?: string | null;
  public provincia?: string | null;
  public localidad?: string | null;
  public barrio?: string | null;
  public domicilio?: string | null;
  public telefono?: string | null;
  public celular?: string | null;
  public zona?: string | null;
  public condicionPago?: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  static initModel(sequelize: Sequelize): typeof ClienteDux {
    ClienteDux.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      fechaCreacion: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
        field: 'fechaCreacion'
      },
      cliente: DataTypes.STRING,
      categoriaFiscal: DataTypes.STRING(100),
      tipoDocumento: DataTypes.STRING(50),
      numeroDocumento: DataTypes.STRING(50),
      cuitCuil: DataTypes.STRING(20),
      cobrador: DataTypes.STRING(100),
      tipoCliente: DataTypes.STRING(100),
      personaContacto: DataTypes.STRING,
      noEditable: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      },
      lugarEntregaPorDefecto: DataTypes.STRING,
      tipoComprobantePorDefecto: DataTypes.STRING(100),
      listaPrecioPorDefecto: DataTypes.STRING(100),
      habilitado: {
        type: DataTypes.TINYINT,
        defaultValue: 1
      },
      nombreFantasia: DataTypes.STRING,
      codigo: DataTypes.STRING(100),
      correoElectronico: DataTypes.STRING,
      vendedor: DataTypes.STRING(100),
      provincia: DataTypes.STRING(100),
      localidad: DataTypes.STRING(100),
      barrio: DataTypes.STRING(100),
      domicilio: DataTypes.STRING,
      telefono: DataTypes.STRING,
      celular: DataTypes.STRING,
      zona: DataTypes.STRING(100),
      condicionPago: DataTypes.STRING(100),
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
    }, {
      sequelize,
      modelName: 'ClienteDux',
      tableName: 'ClientesDux',
      timestamps: true,
      paranoid: true,
    });

    return ClienteDux;
  }
}
