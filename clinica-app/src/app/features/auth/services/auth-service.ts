import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/login`;

  private nombreSubject = new BehaviorSubject<string>(localStorage.getItem('nombre') ?? '');
  nombre$ = this.nombreSubject.asObservable();

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
      })
    );
  }

  getToken(): string | null {

    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {

    return !!this.getToken();
  }

  getNombre(): string {

    return localStorage.getItem('nombre') ?? '';
  }

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    this.nombreSubject.next('');
  }
}