import { Tarea } from "../../../../interfaces/tarea.interface";

export const TAREAS_MOCK: Tarea[] = [

    {
        id: 1,
        tipoRequerimiento: 'Arreglar aire acondicionado',
        descripcion: 'El aire del consultorio 4 pierde agua.',
        estado: 'PENDIENTE',
        local: '852',
        sector: 'Consultorios',
        creador: 'Ana',prioridad: 'ALTA',
        fechaCreacion: '2026-05-20',
        fechaLimite: '2026-05-25',
        asignados: ['Jorge', 'Luisina']
    },

    {
        id: 2,
        tipoRequerimiento: 'Cambiar luminaria',
        descripcion: 'La luz del pasillo principal no funciona.La luz del pasillo principal no funciona.La luz del pasillo principal no funciona.',
        estado: 'PENDIENTE',
        local: '852',
        sector: 'Pasillo',
        creador: 'Ana',
        prioridad: 'ALTA',
        fechaCreacion: '2026-05-18',
        fechaLimite: '2026-05-22',
        asignados: ['Carlos']
    }, {
        id: 22,
        tipoRequerimiento: 'Cambiar luminaria',
        descripcion: 'La luz del pasillo principal no funciona.La luz del pasillo principal no funciona.La luz del pasillo principal no funciona.',
        estado: 'PENDIENTE',
        local: '852', sector: 'Pasillo',
        prioridad: 'ALTA',
        creador: 'Ana',
        fechaCreacion: '2026-05-18',
        fechaLimite: '2026-05-22',
        asignados: ['Carlos']
    }, {
        id: 221,
        tipoRequerimiento: 'Cambiar luminaria',
        descripcion: 'La luz del pasillo principal no funciona.La luz del pasillo principal no funciona.La luz del pasillo principal no funciona.',
        estado: 'PENDIENTE',
        local: '852', sector: 'Pasillo',
        creador: 'Ana',
        prioridad: 'ALTA',
        fechaCreacion: '2026-05-18',
        fechaLimite: '2026-05-22',
        asignados: ['Carlos']
    },
    {
        id: 3,
        tipoRequerimiento: 'Cambiar azulejos',
        descripcion: 'La luz del pasillo principal no funciona.',
        estado: 'NO_REALIZADO',
        local: '852',
        sector: 'Pasillo',
        prioridad: 'MEDIA',
        creador: 'Veronica',
        fechaCreacion: '2026-05-18',
        fechaLimite: '2026-05-22',
        asignados: ['Carlos']
    }, {
        id: 4,
        tipoRequerimiento: 'Arreglar ventilador',
        descripcion: 'El ventilador se traba y hace ruido.',
        estado: 'FINALIZADO',
        local: '853', 
        sector: 'Pasillo',
        prioridad: 'MEDIA',
        creador: 'Veronica',
        fechaCreacion: '2026-05-18',
        fechaLimite: '2026-05-22',
        asignados: ['Carlos']
    }, {
        id: 43,
        tipoRequerimiento: 'Cambiar Lampara',
        descripcion: 'La luz del pasillo principal no funciona.',
        estado: 'FINALIZADO',
        local: '853',
        sector: 'Pasillo',
       creador: 'Ana', prioridad: 'MEDIA',
        fechaCreacion: '2026-05-18',
        fechaLimite: '2026-05-22',
        asignados: ['Carlos']
    }, {
        id: 41,
        tipoRequerimiento: 'Cambiar Lampara',
        descripcion: 'La luz del pasillo principal no funciona.',
        estado: 'FINALIZADO',
        local: '853',
        creador: 'Veronica',
        sector: 'Pasillo',
        prioridad: 'MEDIA',
        fechaCreacion: '2026-05-18',
        fechaLimite: '2026-05-22',
        asignados: ['Carlos']
    }
    , {
        id: 224,
        tipoRequerimiento: 'Arreglar puerta',
        descripcion: 'No cierra bien la puerta del baño de hombres.',
        estado: 'FINALIZADO',
        creador: 'Ana',
        local: '831',
        sector: 'Pasillo',
        prioridad: 'MEDIA',
        fechaCreacion: '2026-05-18',
        fechaLimite: '2026-05-22',
        asignados: ['Carlos']
    }, {
        id: 14,
        tipoRequerimiento: 'Cambiar canilla',
        descripcion: 'La luz del pasillo principal no funciona.',
        estado: 'FINALIZADO',
        local: '831',
        sector: 'Pasillo',
       creador: 'Ana', prioridad: 'MEDIA',
        fechaCreacion: '2026-05-18',
        fechaLimite: '2026-05-22',
        asignados: ['Carlos']
    }
];
