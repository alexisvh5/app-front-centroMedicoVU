import { Header } from './../../../../shared/header/header';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-listar-sectores',
  imports: [Header],
  templateUrl: './listar-sectores.html',
  styleUrl: './listar-sectores.css',
  standalone: true
})
export class ListarSectores {

  private router = inject(Router);
  irAMantenimiento() {
    this.router.navigate(['/mantenimiento']);
  }
}
