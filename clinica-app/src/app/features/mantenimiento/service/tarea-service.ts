import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';
import { Tarea } from '../../../interfaces/tarea.interface';
import { TareaRequestDTO } from '../../../interfaces/tareaRequestDTO';
import { PageResponse } from '../../../interfaces/page-response.interface';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  private readonly baseApiUrl = `${environment.apiUrl}/tareas`;

  private tareasSubject = new BehaviorSubject<Tarea[]>([]);
  tareas$ = this.tareasSubject.asObservable();

  private totalSubject = new BehaviorSubject<number>(0);
  total$ = this.totalSubject.asObservable();

  private http = inject(HttpClient);

  cargarTareas(page: number, size: number, vista: string, filtros: Record<string, string> = {}) {
    const params: Record<string, any> = { page, size, estado: vista };
    Object.entries(filtros).forEach(([key, val]) => {
      if (val) params[key] = val;
    });

    this.http.get<PageResponse<Tarea>>(this.baseApiUrl, { params }).subscribe({
      next: (resp) => {
        this.tareasSubject.next(resp.content);
        this.totalSubject.next(resp.totalElements);
      },
      error: err => console.error('Error al obtener tareas', err)
    });
  }

  getConteo(vista: string): Observable<number> {
    return this.http.get<PageResponse<Tarea>>(this.baseApiUrl, {
      params: { page: 0, size: 1, estado: vista }
    }).pipe(map(r => r.totalElements));
  }

  descargarTodas(vista: string, filtros: Record<string, string>): Observable<Tarea[]> {
    const params: Record<string, any> = { page: 0, size: 9999, estado: vista };
    Object.entries(filtros).forEach(([key, val]) => {
      if (val) params[key] = val;
    });
    return this.http.get<PageResponse<Tarea>>(this.baseApiUrl, { params })
      .pipe(map(r => r.content));
  }

  getTarea(id: number) {
    return this.http.get<Tarea>(`${this.baseApiUrl}/${id}`);
  }

  getTareasPorUsuario(idUsuario: number) {
    return this.http.get<Tarea[]>(`${this.baseApiUrl}/asignado/${idUsuario}`);
  }

  crearTarea(request: TareaRequestDTO) {
    return this.http.post<Tarea>(this.baseApiUrl, request);
  }

  editarTarea(id: number, request: TareaRequestDTO) {
    return this.http.put<Tarea>(`${this.baseApiUrl}/${id}`, request);
  }

  eliminarTarea(id: number) {
    return this.http.delete(`${this.baseApiUrl}/${id}`, { responseType: 'text' });
  }
}
