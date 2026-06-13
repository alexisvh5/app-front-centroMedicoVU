import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

import { ModalCrearEditarTarea } from '../modal-crear-editar-tarea/modal-crear-editar-tarea';
import { CardTareaMobile } from '../card-tarea-mobile/card-tarea-mobile';
import { ModalDetalle } from '../modal-detalle/modal-detalle';
import { TareaService } from '../../service/tarea-service';

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
  private cdr = inject(ChangeDetectorRef);

  tareas: any[] = [];

  mostrarModal = false;
  mostrarDetalle = false;
  tareaSeleccionada: any = null;
  modoModal: 'crear' | 'editar' = 'crear';
  vistaActual: 'activas' | 'finalizadas' = 'activas';

  filtroLocal = '';
  filtroSector = '';
  filtroRequerimiento = '';
  filtroFechaDesde = '';
  filtroFechaHasta = '';

  readonly tamanoPagina = 8;
  paginaActual = 1;

  ngOnInit(): void {
    this.tareaService.cargarTareas();

    this.tareaService.tareas$.subscribe({
      next: (tareas) => {
        this.tareas = tareas;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar tareas:', err);
      }
    });
  }

  get localesUnicos(): string[] {
    return [...new Set(this.tareas.map(t => t.local))].sort();
  }

  get sectoresUnicos(): string[] {
    return [...new Set(this.tareas.map(t => t.sector))].sort();
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
    const total =
      this.vistaActual === 'activas'
        ? this.tareasActivas.length
        : this.tareasFinalizadas.length;

    return Math.max(1, Math.ceil(total / this.tamanoPagina));
  }

  get paginas(): number[] {
    const ventana = 5;

    let inicio = Math.max(
      1,
      this.paginaActual - Math.floor(ventana / 2)
    );

    let fin = inicio + ventana - 1;

    if (fin > this.totalPaginas) {
      fin = this.totalPaginas;
      inicio = Math.max(1, fin - ventana + 1);
    }

    return Array.from(
      { length: fin - inicio + 1 },
      (_, i) => inicio + i
    );
  }

  get tareasActivasPaginadas() {
    const inicio = (this.paginaActual - 1) * this.tamanoPagina;
    return this.tareasActivas.slice(inicio, inicio + this.tamanoPagina);
  }

  get tareasFinalizadasPaginadas() {
    const inicio = (this.paginaActual - 1) * this.tamanoPagina;
    return this.tareasFinalizadas.slice(inicio, inicio + this.tamanoPagina);
  }

  private aplicarFiltros(lista: any[]): any[] {
    return lista.filter(t => {
      const matchLocal =
        !this.filtroLocal || t.local === this.filtroLocal;

      const matchSector =
        !this.filtroSector || t.sector === this.filtroSector;

      const matchReq =
        !this.filtroRequerimiento ||
        t.tipoRequerimiento
          ?.toLowerCase()
          .includes(this.filtroRequerimiento.toLowerCase());

      const matchDesde =
        !this.filtroFechaDesde ||
        t.fechaDeCreacion >= this.filtroFechaDesde;

      const matchHasta =
        !this.filtroFechaHasta ||
        t.fechaDeCreacion <= this.filtroFechaHasta;

      return (
        matchLocal &&
        matchSector &&
        matchReq &&
        matchDesde &&
        matchHasta
      );
    });
  }

  limpiarFiltros() {
    this.filtroLocal = '';
    this.filtroSector = '';
    this.filtroRequerimiento = '';
    this.filtroFechaDesde = '';
    this.filtroFechaHasta = '';
    this.paginaActual = 1;
  }

  cambiarTab(vista: 'activas' | 'finalizadas') {
    this.vistaActual = vista;
    this.paginaActual = 1;
      this.cdr.detectChanges();
  }

  irAPagina(n: number) {
    this.paginaActual = n;
  }

  abrirModal() {
    this.modoModal = 'crear';

    this.tareaSeleccionada = {
      titulo: '',
      descripcion: '',
      sector: '',
      prioridad: '',
      fechaLimite: '',
      empleados: []
    };

    this.mostrarModal = true;
  }

  descargarExcel() {
    let registros: any[];

    if (this.hayFiltrosActivos) {
      registros = this.aplicarFiltros(this.tareas);
    } else {
      const haceUnaSemana = new Date();
      haceUnaSemana.setDate(haceUnaSemana.getDate() - 7);
      const fechaCorte = haceUnaSemana.toISOString().split('T')[0];
      registros = this.tareas.filter(t => t.fechaDeCreacion >= fechaCorte);
    }

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
        'Requerimiento':  t.tipoRequerimiento ?? '',
        'Estado':         t.estado ?? '',
        'Prioridad':      t.prioridad ?? '',
        'Local':          t.local ?? '',
        'Sector':         t.sector ?? '',
        'Días de retraso': diasRetraso,
        'Asignados':      t.asignados ? Object.values(t.asignados).join(', ') : '',
        'Creador':        t.creadorDto?.nombre ?? '',
        'Observaciones':  t.observacion ?? '',
        'Descripción':    t.descripcion ?? '',
      };
    });

    const hoja = XLSX.utils.json_to_sheet(filas);

    // Ancho de columnas basado en el contenido más largo de cada columna
    const columnas = Object.keys(filas[0] ?? {});
    hoja['!cols'] = columnas.map(col => {
      const maxContenido = Math.max(
        col.length,
        ...filas.map(f => String((f as any)[col] ?? '').length)
      );
      return { wch: Math.min(maxContenido + 2, 40) };
    });

    // Congelar la primera fila (encabezados)
    hoja['!freeze'] = { xSplit: 0, ySplit: 1 };

    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Tareas');

    const fecha = new Date().toISOString().split('T')[0];
    XLSX.writeFile(libro, `tareas_${fecha}.xlsx`);
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

  get tareasActivas() {
    const orden: Record<string, number> = {
      NO_REALIZADO: 0,
      PENDIENTE: 1
    };

    return this.aplicarFiltros(
      this.tareas.filter(
        t => t.estado?.toString() !== 'FINALIZADO'
      )
    ).sort(
      (a, b) =>
        (orden[a.estado] ?? 2) -
        (orden[b.estado] ?? 2)
    );
  }

  get tareasFinalizadas() {
    return this.aplicarFiltros(
      this.tareas.filter(
        t => t.estado?.toString() === 'FINALIZADO'
      )
    );
  }

  recargarTareas(): void {
    this.tareaService.cargarTareas();
  }
}
