import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/login`;

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
      })
    );
  }

  getToken(): string | null {

    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {

    return !!this.getToken();
  }

  logout(): void {

    localStorage.removeItem('token');
  }
}