import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../../src/environments/environment';
import { OpcionesTarea } from '../../../interfaces/opciones.interface';

@Injectable({
  providedIn: 'root'
})
export class OpcionesService {

  private http = inject(HttpClient);

  private readonly baseApiUrl =
    `${environment.apiUrl}/opciones`;

  obtenerOpcionesTarea(): Observable<OpcionesTarea> {

    return this.http.get<OpcionesTarea>(
      `${this.baseApiUrl}/tareas`
    );
  }
}