import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tarea } from '../../../../interfaces/tarea.interface';
@Component({
  selector: 'app-modal-detalle',

  standalone: true,

  imports: [CommonModule, FormsModule],
  templateUrl: './modal-detalle.html',
  styleUrl: './modal-detalle.css',
})
export class ModalDetalle {
  @Input() visible = false;

  @Input() tarea!: Tarea;

  @Output() cerrar = new EventEmitter<void>();

  observacion = '';

  readonly maxCaracteres = 150;

  obtenerDemora(tarea: Tarea): number {
    if (!tarea.fechaObjetivo) {
      return 0;
    }

    const hoy = new Date();
    const objetivo = new Date(tarea.fechaObjetivo);

    // Ignorar horas
    hoy.setHours(0, 0, 0, 0);
    objetivo.setHours(0, 0, 0, 0);

    const diferenciaMs = hoy.getTime() - objetivo.getTime();

    if (diferenciaMs <= 0) {
      return 0;
    }

    return Math.floor(
      diferenciaMs / (1000 * 60 * 60 * 24)
    );
  }
}
