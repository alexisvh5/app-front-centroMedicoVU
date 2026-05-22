import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  loginForm: FormGroup;

  mostrarPassword = false;

  loading = false;

  submitted = false;

  mensajeError = '';

  mensajeExito = '';

  constructor(private fb: FormBuilder) {

    this.loginForm = this.fb.group({
      dni: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  togglePassword(): void {

    this.mostrarPassword = !this.mostrarPassword;

  }

  loguearse(): void {

    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    console.log(this.loginForm.value);

    // Simulación login

    setTimeout(() => {

      this.loading = false;

      this.mensajeExito = 'Login exitoso';

    }, 1500);

    this.router.navigate(['/home']);

  }

}