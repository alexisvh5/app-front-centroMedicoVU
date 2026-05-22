import { Tarea } from "./tarea.interface";
export interface Usuarios {
    id?: number;
    nombre: string;
    clave: string;
    dni: number;
    especialidad: string;
    administrador?: string;
    // Tareas que creó (asignó)
    tareasCreadas?: Tarea[];
    tareasAsignadas?: Tarea[];
}