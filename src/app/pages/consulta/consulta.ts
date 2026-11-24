
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Curso } from '../../models/curso.model';
import { Inscripcion } from '../../models/inscripcion.model';
import { BaseDatos } from '../../services/base-datos';
import { CursoCard } from '../../components/curso-card/curso-card';

@Component({
  selector: 'app-consulta',
  standalone: true,
  imports: [CursoCard],
  templateUrl: './consulta.html',
  styleUrl: './consulta.css',
})
export class Consulta implements OnInit {

  cursos: Curso[] = [];
  inscripciones: Inscripcion[] = [];

  mensajeError: string = '';

  textoBusqueda: string = '';
  categoriaSeleccionada: string = '';

  cursoSeleccionado: Curso | null = null;

  constructor(
    private baseDatos: BaseDatos,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.cursos = await this.baseDatos.obtenerCursos();
      this.inscripciones = await this.baseDatos.obtenerInscripciones();

      this.cdr.markForCheck();

    } catch (error) {
      this.mensajeError = 'No se pudieron cargar los cursos.';

      console.error('Error al obtener información:', error);

      this.cdr.markForCheck();
    }
  }

  get categorias(): string[] {
    return [...new Set(
      this.cursos.map(curso => curso.categoria)
    )];
  }

  get cursosFiltrados(): Curso[] {
    return this.cursos.filter(curso => {

      const texto = this.textoBusqueda.toLowerCase().trim();

      const coincideTexto =
        curso.nombre.toLowerCase().includes(texto) ||
        curso.descripcion.toLowerCase().includes(texto);

      const coincideCategoria =
        this.categoriaSeleccionada === '' ||
        curso.categoria === this.categoriaSeleccionada;

      return coincideTexto && coincideCategoria;
    });
  }

  get inscripcionesActivas(): number {
    if (!this.cursoSeleccionado) {
      return 0;
    }

    return this.inscripciones.filter(inscripcion =>
      inscripcion.cursoId === this.cursoSeleccionado!.id &&
      inscripcion.estado === 'activa'
    ).length;
  }

  get cuposDisponibles(): number {
    if (!this.cursoSeleccionado) {
      return 0;
    }

    return Math.max(
      0,
      this.cursoSeleccionado.capacidad - this.inscripcionesActivas
    );
  }

  get cursoLleno(): boolean {
    return this.cuposDisponibles === 0;
  }

  seleccionarCurso(curso: Curso): void {
    this.cursoSeleccionado = curso;
    this.cdr.markForCheck();
  }

  cerrarModal(): void {
    this.cursoSeleccionado = null;
    this.cdr.markForCheck();
  }
}
