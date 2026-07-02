import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly apiUrl = `${environment.apiUrl}/login`;

  private nombreSubject = new BehaviorSubject<string>(localStorage.getItem('nombre') ?? '');
  nombre$ = this.nombreSubject.asObservable();

  private timerControl: ReturnType<typeof setInterval> | null = null;

  login(dni: string, clave: string): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}`,
      {
        dni,
        clave
      }
    ).pipe(

      tap(response => {

        localStorage.setItem('token', response.token);
        if (response.nombre) {
          localStorage.setItem('nombre', response.nombre);
          this.nombreSubject.next(response.nombre);
        }
        this.iniciarControlDeExpiracion();
      })
    );
  }

  iniciarControlDeExpiracion(): void {
    this.detenerControlDeExpiracion();
    this.timerControl = setInterval(() => {
      if (this.isTokenExpirado()) {
        this.logout();
        this.router.navigate(['/login'], { queryParams: { expirado: true } });
      }
    }, 30000);
  }

  private detenerControlDeExpiracion(): void {
    if (this.timerControl) {
      clearInterval(this.timerControl);
      this.timerControl = null;
    }
  }

  getToken(): string | null {

    return localStorage.getItem('token');
  }

  isTokenExpirado(): boolean {
    const token = this.getToken();
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < Math.floor(Date.now() / 1000);
    } catch {
      return true;
    }
  }

  isLoggedIn(): boolean {

    return !!this.getToken() && !this.isTokenExpirado();
  }

  getNombre(): string {

    return localStorage.getItem('nombre') ?? '';
  }

  logout(): void {

    this.detenerControlDeExpiracion();
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    this.nombreSubject.next('');
  }
}