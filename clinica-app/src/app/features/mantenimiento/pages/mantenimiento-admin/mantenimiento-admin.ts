import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

import { ModalCrearEditarTarea } from '../modal-crear-editar-tarea/modal-crear-editar-tarea';
import { CardTareaMobile } from '../card-tarea-mobile/card-tarea-mobile';
import { ModalDetalle } from '../modal-detalle/modal-detalle';
import { TareaService } from '../../service/tarea-service';
import { OpcionesService } from '../../../opciones/service/opciones-service';
import { Tarea } from '../../../../interfaces/tarea.interface';

@Component({
  selector: 'app-mantenimiento-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalCrearEditarTarea,
    CardTareaMobile,
    ModalDetalle
  ],
  templateUrl: './mantenimiento-admin.html',
  styleUrl: './mantenimiento-admin.css',
})
export class MantenimientoAdmin implements OnInit {

  private tareaService = inject(TareaService);
  private opcionesService = inject(OpcionesService);
  private cdr = inject(ChangeDetectorRef);

  tareas: Tarea[] = [];

  mostrarModal = false;
  mostrarDetalle = false;
  tareaSeleccionada!: Tarea;
  modoModal: 'crear' | 'editar' = 'crear';
  vistaActual: 'activas' | 'finalizadas' = 'activas';

  filtroLocal = '';
  filtroSector = '';
  filtroRequerimiento = '';
  filtroFechaDesde = '';
  filtroFechaHasta = '';

  readonly tamanoPagina = 8;
  paginaActual = 1;
  totalActivas = 0;
  totalFinalizadas = 0;

  totalActivasBadge = 0;
  totalFinalizadasBadge = 0;

  localesUnicos: string[] = [];
  sectoresUnicos: string[] = [];

  ngOnInit(): void {
    this.opcionesService.obtenerOpcionesTarea().subscribe({
      next: (opciones) => {
        this.localesUnicos = opciones.locales;
        this.sectoresUnicos = opciones.sectores;
      },
      error: (err) => console.error('Error al cargar opciones:', err)
    });

    this.tareaService.tareas$.subscribe({
      next: (tareas) => {
        this.tareas = tareas;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar tareas:', err)
    });

    this.tareaService.total$.subscribe(total => {
      if (this.vistaActual === 'activas') {
        this.totalActivas = total;
      } else {
        this.totalFinalizadas = total;
      }
    });

    this.cargarTareasFiltradas();
    this.actualizarContadoresBadge();
  }

  private actualizarContadoresBadge(): void {
    this.tareaService.getConteo('activas').subscribe(total => {
      this.totalActivasBadge = total;
      this.cdr.detectChanges();
    });
    this.tareaService.getConteo('finalizadas').subscribe(total => {
      this.totalFinalizadasBadge = total;
      this.cdr.detectChanges();
    });
  }

  get hayFiltrosActivos(): boolean {
    return !!(
      this.filtroLocal ||
      this.filtroSector ||
      this.filtroRequerimiento ||
      this.filtroFechaDesde ||
      this.filtroFechaHasta
    );
  }

  get totalPaginas(): number {
    const total = this.vistaActual === 'activas' ? this.totalActivas : this.totalFinalizadas;
    return Math.max(1, Math.ceil(total / this.tamanoPagina));
  }

  get paginas(): number[] {
    const ventana = 5;
    let inicio = Math.max(1, this.paginaActual - Math.floor(ventana / 2));
    let fin = inicio + ventana - 1;
    if (fin > this.totalPaginas) {
      fin = this.totalPaginas;
      inicio = Math.max(1, fin - ventana + 1);
    }
    return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);
  }

  get tareasActivasPaginadas(): Tarea[] {
    return this.tareas;
  }

  get tareasFinalizadasPaginadas(): Tarea[] {
    return this.tareas;
  }

  onFiltroChange() {
    this.paginaActual = 1;
    this.cargarTareasFiltradas();
  }

  limpiarFiltros() {
    this.filtroLocal = '';
    this.filtroSector = '';
    this.filtroRequerimiento = '';
    this.filtroFechaDesde = '';
    this.filtroFechaHasta = '';
    this.paginaActual = 1;
    this.cargarTareasFiltradas();
  }

  cambiarTab(vista: 'activas' | 'finalizadas') {
    this.vistaActual = vista;
    this.paginaActual = 1;
    this.cargarTareasFiltradas();
    this.actualizarContadoresBadge();
    this.cdr.detectChanges();
  }

  irAPagina(n: number) {
    if (n < 1 || n > this.totalPaginas) return;
    this.paginaActual = n;
    this.cargarTareasFiltradas();
  }

  private cargarTareasFiltradas() {
    this.tareaService.cargarTareas(
      this.paginaActual - 1,
      this.tamanoPagina,
      this.vistaActual,
      this.obtenerFiltros()
    );
  }

  private obtenerFiltros(): Record<string, string> {
    return {
      local: this.filtroLocal,
      sector: this.filtroSector,
      tipoRequerimiento: this.filtroRequerimiento,
      fechaDesde: this.filtroFechaDesde,
      fechaHasta: this.filtroFechaHasta
    };
  }

  private crearTareaVacia(): Tarea {
    return {
      id: 0,
      fechaDeCreacion: '',
      fechaObjetivo: '',
      estado: '',
      creadorDto: { id: 0, nombre: '' },
      asignados: {},
      descripcion: '',
      tipoRequerimiento: '',
      local: '',
      sector: '',
      prioridad: '',
      observacion: ''
    };
  }

  abrirModal() {
    this.modoModal = 'crear';
    this.tareaSeleccionada = this.crearTareaVacia();
    this.mostrarModal = true;
  }

  descargarExcel() {
    this.tareaService.descargarTodas(this.vistaActual, this.obtenerFiltros()).subscribe(registros => {
      if (!registros.length) return;

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const filas = registros.map(t => {
        let diasRetraso = 0;
        if (t.fechaObjetivo && t.estado !== 'FINALIZADO') {
          const objetivo = new Date(t.fechaObjetivo);
          objetivo.setHours(0, 0, 0, 0);
          const diff = hoy.getTime() - objetivo.getTime();
          diasRetraso = diff > 0 ? Math.floor(diff / (1000 * 60 * 60 * 24)) : 0;
        }
        return {
          'Fecha creación': t.fechaDeCreacion ?? '',
          'Requerimiento': t.tipoRequerimiento ?? '',
          'Estado': t.estado ?? '',
          'Prioridad': t.prioridad ?? '',
          'Local': t.local ?? '',
          'Sector': t.sector ?? '',
          'Días de retraso': diasRetraso,
          'Asignados': t.asignados ? Object.values(t.asignados).join(', ') : '',
          'Creador': t.creadorDto?.nombre ?? '',
          'Observaciones': t.observacion ?? '',
          'Descripción': t.descripcion ?? '',
        };
      });

      const hoja = XLSX.utils.json_to_sheet(filas);
      const columnas = Object.keys(filas[0]);
      hoja['!cols'] = columnas.map(col => {
        const maxContenido = Math.max(col.length, ...filas.map(f => String((f as any)[col] ?? '').length));
        return { wch: Math.min(maxContenido + 2, 40) };
      });
      hoja['!freeze'] = { xSplit: 0, ySplit: 1 };

      const libro = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(libro, hoja, 'Tareas');
      const fecha = new Date().toISOString().split('T')[0];
      XLSX.writeFile(libro, `tareas_${fecha}.xlsx`);
    });
  }

  abrirDetalle(tarea: any) {
    this.tareaSeleccionada = tarea;
    this.mostrarDetalle = true;
  }

  abrirEditar(tarea: any) {
    this.modoModal = 'editar';
    this.tareaSeleccionada = { ...tarea };
    this.mostrarModal = true;
  }

  recargarTareas(): void {
    this.cargarTareasFiltradas();
    this.actualizarContadoresBadge();
  }

  eliminarTarea(tarea: Tarea): void {
    if (!confirm(`¿Eliminar la tarea "${tarea.tipoRequerimiento}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    this.tareaService.eliminarTarea(tarea.id).subscribe({
      next: () => this.recargarTareas(),
      error: (err) => console.error('Error al eliminar tarea:', err)
    });
  }
}
