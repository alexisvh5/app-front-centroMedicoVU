import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-crear-editar-tarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-crear-editar-tarea.html',
  styleUrl: './modal-crear-editar-tarea.css',
})
export class ModalCrearEditarTarea {

  @Input() visible = false;

  @Input() modo: 'crear' | 'editar' = 'crear';

  @Input() tarea: any = {

    titulo: '',

    descripcion: '',

    sector: '',

    prioridad: '',

    fechaLimite: '',

    empleados: []

  };

  @Output() cerrar = new EventEmitter<void>();

  guardar() {

    console.log('TAREA:', this.tarea);

    this.cerrar.emit();
  }

  empleadosDisponibles = [

    'Jorge',

    'Carlos',

    'Luisina',

    'Matías',

    'Camila'

  ];

  toggleEmpleado(empleado: string) {

    const existe = this.tarea.empleados.includes(empleado);

    if (existe) {

      this.tarea.empleados =
        this.tarea.empleados.filter(
          (e: string) => e !== empleado
        );

    } else {

      this.tarea.empleados.push(empleado);
    }
  }

}
