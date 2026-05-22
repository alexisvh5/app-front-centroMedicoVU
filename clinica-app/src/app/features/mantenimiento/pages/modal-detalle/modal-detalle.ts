import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-detalle',

  standalone: true,

  imports: [CommonModule],
  templateUrl: './modal-detalle.html',
  styleUrl: './modal-detalle.css',
})
export class ModalDetalle {
  @Input() visible = false;

  @Input() tarea: any;

  @Output() cerrar = new EventEmitter<void>();

}
