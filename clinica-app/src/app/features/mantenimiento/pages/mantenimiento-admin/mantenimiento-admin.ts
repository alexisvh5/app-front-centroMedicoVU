import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ModalCrearEditarTarea } from '../modal-crear-editar-tarea/modal-crear-editar-tarea';
import { CardTareaMobile } from '../card-tarea-mobile/card-tarea-mobile';
import { Header } from './../../../../shared/header/header';
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
    Header,
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
        t.fechaCreacion >= this.filtroFechaDesde;

      const matchHasta =
        !this.filtroFechaHasta ||
        t.fechaCreacion <= this.filtroFechaHasta;

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

  descargarPdf() {
    console.log('Descargando PDF con las tareas...');
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
}