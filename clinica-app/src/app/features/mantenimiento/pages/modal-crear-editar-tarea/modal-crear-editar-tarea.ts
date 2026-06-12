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

    if (
      changes['tarea'] &&
      this.tarea
    ) {

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

  guardar(): void {

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