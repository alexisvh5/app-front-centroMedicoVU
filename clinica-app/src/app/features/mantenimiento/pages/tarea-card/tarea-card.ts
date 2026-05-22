import { Component, Input } from '@angular/core';
import { Tarea } from "../../../../interfaces/tarea.interface";
import { CommonModule } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-tarea-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarea-card.html',
  styleUrl: './tarea-card.css',
})
export class TareaCard {
  @Input() tarea: any;

  @Output() verDetalle = new EventEmitter();

  @Output() editar = new EventEmitter();
}
