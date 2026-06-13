import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UsuarioService } from '../../../usuario/service/usuario-service';
import { Usuarios } from '../../../../interfaces/usuarios.interface';
import { Tarea } from '../../../../interfaces/tarea.interface';
import { OpcionesService } from '../../../opciones/service/opciones-service';
import { OpcionesTarea } from '../../../../interfaces/opciones.interface';
import { TareaService } from '../../service/tarea-service';

@Component({
  selector: 'app-modal-crear-editar-tarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-crear-editar-tarea.html',
  styleUrl: './modal-crear-editar-tarea.css',
})
export class ModalCrearEditarTarea implements OnInit, OnChanges {

  private usuarioService = inject(UsuarioService);
  private opcionesService = inject(OpcionesService);
  private tareaService = inject(TareaService);
  opciones: OpcionesTarea = {
    locales: [],
    sectores: [],
    prioridades: [],
    estados: [],
    tiposRequerimiento: []
  };

  empleadosDisponibles: Usuarios[] = [];

  empleadosSeleccionados: number[] = [];

  errores: Record<string, string> = {};

  @Input() visible = false;

  @Input() modo: 'crear' | 'editar' = 'crear';

  @Input() tarea!: Tarea;

  @Output() cerrar = new EventEmitter<void>();

  @Output() guardado = new EventEmitter<void>();

  ngOnInit(): void {

    this.usuarioService
      .obtenerMantenimiento()
      .subscribe({
        next: (usuarios) => {
          this.empleadosDisponibles = usuarios;
        }
      });

    this.opcionesService
      .obtenerOpcionesTarea()
      .subscribe({
        next: (opciones) => {
          this.opciones = opciones;
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['visible']) {
      this.errores = {};
    }

    if (changes['tarea'] && this.tarea) {

      this.errores = {};

      this.empleadosSeleccionados =
        this.tarea.asignados
          ? Object.keys(this.tarea.asignados).map(Number)
          : [];

      if (this.tarea.fechaObjetivo) {
        this.tarea.fechaObjetivo =
          this.tarea.fechaObjetivo.split('T')[0];
      }
    }
  }

  estaSeleccionado(id: number): boolean {
    return this.empleadosSeleccionados.includes(id);
  }

  toggleEmpleado(id: number): void {

    const existe =
      this.empleadosSeleccionados.includes(id);

    if (existe) {

      this.empleadosSeleccionados =
        this.empleadosSeleccionados.filter(
          e => e !== id
        );

    } else {

      this.empleadosSeleccionados.push(id);
    }
  }

  private validarFormulario(): boolean {

    this.errores = {};

    if (!this.tarea.local) {
      this.errores['local'] = 'Debe seleccionar un local';
    }

    if (!this.tarea.sector) {
      this.errores['sector'] = 'Debe seleccionar un sector';
    }

    if (!this.tarea.tipoRequerimiento) {
      this.errores['tipoRequerimiento'] = 'Debe seleccionar un tipo';
    }

    if (!this.tarea.descripcion?.trim()) {
      this.errores['descripcion'] = 'La descripción es obligatoria';
    } else if (this.tarea.descripcion.trim().length < 10) {
      this.errores['descripcion'] = 'Mínimo 10 caracteres';
    }

    if (!this.tarea.prioridad) {
      this.errores['prioridad'] = 'Debe seleccionar una prioridad';
    }

    if (this.empleadosSeleccionados.length === 0) {
      this.errores['empleados'] = 'Debe asignar al menos un empleado';
    }

    if (!this.tarea.fechaObjetivo) {
      this.errores['fechaObjetivo'] = 'Debe seleccionar una fecha';
    } else {

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const fecha = new Date(this.tarea.fechaObjetivo);

      if (fecha < hoy) {
        this.errores['fechaObjetivo'] =
          'La fecha no puede ser anterior a hoy';
      }
    }

    if (this.modo === 'editar' && !this.tarea.estado) {
      this.errores['estado'] = 'Debe seleccionar un estado';
    }

    return Object.keys(this.errores).length === 0;
  }

  guardar(): void {

    if (!this.validarFormulario()) {
      return;
    }

    const request = {

      estado: this.tarea.estado,

      local: this.tarea.local,

      sector: this.tarea.sector,

      tipoRequerimiento: this.tarea.tipoRequerimiento,

      descripcion: this.tarea.descripcion,

      prioridad: this.tarea.prioridad,

      asignadosIds: this.empleadosSeleccionados,

      fechaObjetivo:
        this.tarea.fechaObjetivo
          ? `${this.tarea.fechaObjetivo}T00:00:00`
          : ''
    };

    if (this.modo === 'crear') {

      this.tareaService
        .crearTarea(request)
        .subscribe({

          next: (tarea) => {

            console.log(
              'Tarea creada',
              tarea
            );
            this.guardado.emit();
            this.cerrar.emit();
          },

          error: (err) => {

            console.error(
              'Error al crear tarea',
              err
            );
          }
        });

    } else {

      this.tareaService
        .editarTarea(
          this.tarea.id,
          request
        )
        .subscribe({

          next: (tarea) => {

            console.log(
              'Tarea editada',
              tarea
            );
            this.guardado.emit();
            this.cerrar.emit();
          },

          error: (err) => {

            console.error(
              'Error al editar tarea',
              err
            );
          }
        });
    }
  }

}