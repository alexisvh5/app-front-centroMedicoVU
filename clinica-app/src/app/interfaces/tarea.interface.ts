import { CreadorDTO } from "./creadorDTO";

export interface Tarea {
  id: number;

  fechaDeCreacion: string;
  fechaObjetivo: string;

  estado: string;

  creadorDto: CreadorDTO;

  asignados: Record<number, string>;

  descripcion: string;

  tipoRequerimiento: string;
  local: string;
  sector: string;
  prioridad: string;

  observacion: string;
}