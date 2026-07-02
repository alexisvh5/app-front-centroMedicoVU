import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tarea } from '../../../../interfaces/tarea.interface';
import { TareaService } from '../../service/tarea-service';
import { FinalizarTareaRequest } from '../../../../interfaces/FinalizarTareaRequest';
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
  @Output() tareaFinalizada = new EventEmitter<void>();

  tareaService = inject(TareaService);

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
  finalizar(): void {
    const request: FinalizarTareaRequest = {
      observacion: this.observacion
    };
    this.tareaService.finalizarTarea(this.tarea.id, request).subscribe({
      next: () => {
        this.tareaFinalizada.emit();
        this.cerrar.emit();
      },
      error: (error) => {
        console.error('Error al finalizar la tarea:', error);
      }
    });
  }
}
