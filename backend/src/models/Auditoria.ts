export interface Auditoria {
  id: number;
  entidad: string;
  operacion: string;
  fecha: Date;
  usuarioId: number;
}
