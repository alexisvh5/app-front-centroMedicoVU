import { Usuarios } from "./usuarios.interface";
import { Sector } from "../enums/Sector";
import { SubSector } from "../enums/SubSector";
import { TipoMantenimiento } from "../enums/TipoMantenimiento";
import { Estado } from "../enums/Estado";
export interface Tarea {
    id: number;

    titulo: string;

    descripcion: string;

    estado: string;

    sector: string;

    prioridad: string;

    fechaCreacion: string;

    fechaLimite: string;

    observaciones?: string;

    asignados: string[];
}