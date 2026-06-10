import { Component, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import { AuthService } from '../../features/auth/services/auth-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  authService = inject(AuthService);
  private router = inject(Router);

  menuOpen = false;

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('document:click')
  closeMenu() {
    this.menuOpen = false;
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
