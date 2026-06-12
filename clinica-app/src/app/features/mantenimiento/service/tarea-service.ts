import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';
import { Tarea } from '../../../interfaces/tarea.interface';
import { TareaRequestDTO } from '../../../interfaces/tareaRequestDTO';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  private readonly baseApiUrl = `${environment.apiUrl}/tareas`;

  private tareasSubject = new BehaviorSubject<Tarea[]>([]);
  tareas$ = this.tareasSubject.asObservable();

  private http = inject(HttpClient);

  cargarTareas() {
    this.http.get<Tarea[]>(this.baseApiUrl).subscribe({
      next: tareas => {
        this.tareasSubject.next(tareas);
      },
      error: err => {
        console.error('Error al obtener tareas', err);
      }
    });
  }

  getTarea(id: number) {
    return this.http.get<Tarea>(`${this.baseApiUrl}/${id}`);
  }

  getTareasPorUsuario(idUsuario: number) {
    return this.http.get<Tarea[]>(`${this.baseApiUrl}/asignado/${idUsuario}`);
  }

  crearTarea(
    request: TareaRequestDTO
  ) {
    return this.http.post<Tarea>(
      this.baseApiUrl,
      request
    );
  }

  editarTarea(
    id: number,
    request: TareaRequestDTO
  ) {
    return this.http.put<Tarea>(
      `${this.baseApiUrl}/${id}`,
      request
    );
  }

  eliminarTarea(id: number) {
    return this.http.delete(`${this.baseApiUrl}/${id}`);
  }
}