import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  submitted = false;
  loading = false;

  mensajeError = '';
  mensajeExito = '';

  mostrarPassword = false;

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  loginForm = this.fb.nonNullable.group({

    dni: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9]{7,8}$/)
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(2)
      ]
    ]
  });

  ngOnInit() {

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
      return;
    }

    if (this.route.snapshot.queryParams['expirado']) {
      this.mensajeError = 'Tu sesión expiró. Volvé a iniciar sesión.';
    }
  }

  loguearse() {

    this.submitted = true;

    this.loginForm.markAllAsTouched();

    this.mensajeError = '';

    if (this.loginForm.invalid) {

      this.mensajeError = 'Completá correctamente los campos.';

      this.cdr.detectChanges();

      return;
    }

    this.loading = true;

    const { dni, password } = this.loginForm.getRawValue();

    this.authService.login(dni, password)
      .pipe(
        finalize(() => {

          this.loading = false;

          this.cdr.detectChanges();
        })
      )
      .subscribe({

        next: () => {

          this.router.navigate(['/home']);
        },

        error: (err) => {

          if (err.status === 401 || err.status === 403) {

            this.mensajeError = 'DNI o contraseña incorrectos.';

          } else if (err.status === 0) {

            this.mensajeError = 'No se pudo conectar con el servidor.';

          } else {

            this.mensajeError = 'Ocurrió un error inesperado.';
          }

          this.cdr.detectChanges();
        }
      });
  }

  irARegistro() {

    this.router.navigate(['/registro']);
  }
}