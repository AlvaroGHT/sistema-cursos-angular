
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Inscripcion } from '../../models/inscripcion.model';
import { Curso } from '../../models/curso.model';
import { BaseDatos } from '../../services/base-datos';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  styleUrl: './historial.css',
  templateUrl: './historial.html'
})
export class Historial implements OnInit {

  inscripciones: Inscripcion[] = [];
  cursos: Curso[] = [];

  mensajeError: string = '';
  filtroEstado: string = 'todas';
  busqueda: string = '';

  constructor(
    private baseDatos: BaseDatos,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {

    try {

      const resultados = await Promise.all([
        this.baseDatos.obtenerInscripciones(),
        this.baseDatos.obtenerCursos()
      ]);

      this.inscripciones = resultados[0];
      this.cursos = resultados[1];

      console.log('Inscripciones recuperadas:', this.inscripciones);
      console.log('Cantidad de inscripciones:', this.inscripciones.length);

      this.cdr.markForCheck();

    } catch (error) {

      this.mensajeError = 'No se pudo cargar el historial.';

      console.error('Error al cargar el historial:', error);

      this.cdr.markForCheck();

    }

  }

  get inscripcionesFiltradas(): Inscripcion[] {

    const textoBusqueda = this.busqueda.trim().toLowerCase();

    return this.inscripciones.filter(inscripcion => {

      const coincideEstado =
        this.filtroEstado === 'todas' ||
        inscripcion.estado === this.filtroEstado;

      const nombreCompleto =
        `${inscripcion.estudiante.nombre} ${inscripcion.estudiante.apellido}`.toLowerCase();

      const correo =
        inscripcion.estudiante.correo.toLowerCase();

      const coincideBusqueda =
        nombreCompleto.includes(textoBusqueda) ||
        correo.includes(textoBusqueda);

      return coincideEstado && coincideBusqueda;

    });

  }

  obtenerNombreCurso(cursoId: number): string {

    const curso = this.cursos.find(
      curso => curso.id === cursoId
    );

    return curso ? curso.nombre : 'Curso no encontrado';

  }

}
