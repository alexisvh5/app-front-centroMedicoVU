export interface Tarea {
  id: number;

  fechaDeCreacion: string;
  fechaObjetivo: string;

  estado: string;

  creadorDto: any;

  asignados: Record<number, string>;

  descripcion: string;

  tipoRequerimiento: string;
  local: string;
  sector: string;
  prioridad: string;

  observacion: string;
}