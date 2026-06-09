import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-modal-detalle',

  standalone: true,

  imports: [CommonModule, FormsModule],
  templateUrl: './modal-detalle.html',
  styleUrl: './modal-detalle.css',
})
export class ModalDetalle {
  @Input() visible = false;

  @Input() tarea: any;

  @Output() cerrar = new EventEmitter<void>();
  
  observacion = '';

  readonly maxCaracteres = 150;

}
