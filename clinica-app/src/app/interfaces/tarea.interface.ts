import { Usuarios } from "./usuarios.interface";
import { Sector } from "../enums/Sector";
import { SubSector } from "../enums/SubSector";
import { TipoMantenimiento } from "../enums/TipoMantenimiento";
import { Estado } from "../enums/Estado";
export interface Tarea {
    id: number;

    tipoRequerimiento: string;

    fechaCreacion: string;

    fechaLimite: string;

    estado: string;

    creador: string;

    asignados: string[];

    descripcion: string;

    local: string;

    sector: string;

    prioridad: string;

    observacion: string;

}
