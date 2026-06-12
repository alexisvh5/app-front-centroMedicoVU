export interface TareaRequestDTO {

  creadorId?: number;

  estado: string;

  local: string;

  sector: string;

  tipoRequerimiento: string;

  descripcion: string;

  prioridad: string;

  asignadosIds: number[];

  fechaObjetivo: string;
}