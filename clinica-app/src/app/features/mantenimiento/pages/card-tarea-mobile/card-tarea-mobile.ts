import { Component, Input } from '@angular/core';
import { Tarea } from "../../../../interfaces/tarea.interface";
import { CommonModule } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-card-tarea-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-tarea-mobile.html',
  styleUrl: './card-tarea-mobile.css',
})
export class CardTareaMobile {
  @Input() tarea!: Tarea;

  @Output() verDetalle = new EventEmitter();

  @Output() editar = new EventEmitter();
  @Output() eliminar = new EventEmitter();
  isOpen = false;
}
