import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuarios } from '../../../interfaces/usuarios.interface';
import { environment } from '../../../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);

  private readonly baseApiUrl = `${environment.apiUrl}/usuarios`;

  obtenerMantenimiento(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(
      `${this.baseApiUrl}/obtenerUsuariosMantenimiento`
    );
  }
}
