import { Tarea } from "../../../../interfaces/tarea.interface";

export const TAREAS_MOCK: Tarea[] = [

    {
        id: 1,
        titulo: 'Arreglar aire acondicionado',
        descripcion: 'El aire del consultorio 4 pierde agua.',
        estado: 'PENDIENTE',
        sector: 'Consultorios',
        prioridad: 'ALTA',
        fechaCreacion: '2026-05-20',
        fechaLimite: '2026-05-25',
        empleados: ['Jorge', 'Luisina']
    },

    {
        id: 2,
        titulo: 'Cambiar luminaria',
        descripcion: 'La luz del pasillo principal no funciona.',
        estado: 'FINALIZADO',
        sector: 'Pasillo',
        prioridad: 'MEDIA',
        fechaCreacion: '2026-05-18',
        fechaLimite: '2026-05-22',
        empleados: ['Carlos']
    }

];