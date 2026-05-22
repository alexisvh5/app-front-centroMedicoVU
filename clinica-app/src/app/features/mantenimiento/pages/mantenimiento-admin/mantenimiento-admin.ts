import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TAREAS_MOCK } from '../tareas-mock/tareas-mock';

import { TareaCard } from '../tarea-card/tarea-card';
import { ModalTarea } from '../modal-tarea/modal-tarea';
import { ModalDetalle } from '../modal-detalle/modal-detalle';
import { Header } from './../../../../shared/header/header';
@Component({
  selector: 'app-mantenimiento-admin',
  standalone: true,
  imports: [CommonModule, TareaCard, ModalTarea, ModalDetalle, Header],
  templateUrl: './mantenimiento-admin.html',
  styleUrl: './mantenimiento-admin.css',
})
export class MantenimientoAdmin {

  tareas = TAREAS_MOCK;
  mostrarModal = false;

  mostrarDetalle = false;

  tareaSeleccionada: any = null;
  modoModal: 'crear' | 'editar' = 'crear';
  abrirModal() {

    this.modoModal = 'crear';

    this.tareaSeleccionada = {

      titulo: '',

      descripcion: '',

      sector: '',

      prioridad: '',

      fechaLimite: '',

      empleados: []

    };

    this.mostrarModal = true;
  }

  abrirDetalle(tarea: any) {

    this.tareaSeleccionada = tarea;

    this.mostrarDetalle = true;
  }
  abrirEditar(tarea: any) {

    this.modoModal = 'editar';

    this.tareaSeleccionada = { ...tarea };

    this.mostrarModal = true;
  }
}