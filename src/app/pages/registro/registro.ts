
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Curso } from '../../models/curso.model';
import { Estudiante } from '../../models/estudiante.model';
import { BaseDatos } from '../../services/base-datos';

@Component({
  imports: [FormsModule],
  selector: 'app-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class Registro implements OnInit {

  cursos: Curso[] = [];

  nombre: string = '';
  apellido: string = '';
  correo: string = '';
  cursoId: number = 0;

  mensaje: string = '';
  tipoMensaje: string = '';

  constructor(
    private baseDatos: BaseDatos,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {

    try {

      this.cursos = await this.baseDatos.obtenerCursos();

      this.cdr.markForCheck();

    } catch (error) {

      this.mensaje = 'No se pudieron cargar los cursos.';
      this.tipoMensaje = 'error';

      console.error('Error al cargar los cursos:', error);

      this.cdr.markForCheck();

    }

  }

  async registrar(): Promise<void> {

    this.mensaje = '';
    this.tipoMensaje = '';

    // Validar campos
    if (
      !this.nombre.trim() ||
      !this.apellido.trim() ||
      !this.correo.trim() ||
      this.cursoId === 0
    ) {

      this.mensaje = 'Completa todos los campos antes de continuar.';
      this.tipoMensaje = 'error';

      this.cdr.markForCheck();

      return;
    }

    // Validar formato del correo
    const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!expresionCorreo.test(this.correo.trim())) {

      this.mensaje = 'Ingresa un correo electrónico válido.';
      this.tipoMensaje = 'error';

      this.cdr.markForCheck();

      return;
    }

    const estudiante: Estudiante = {
      id: Date.now(),
      nombre: this.nombre.trim(),
      apellido: this.apellido.trim(),
      correo: this.correo.trim()
    };

    try {

      await this.baseDatos.registrarInscripcion(
        estudiante,
        Number(this.cursoId)
      );

      this.mensaje = 'La inscripción se registró correctamente.';
      this.tipoMensaje = 'exito';

      // Limpiar formulario
      this.nombre = '';
      this.apellido = '';
      this.correo = '';
      this.cursoId = 0;

      // Actualizar la pantalla
      this.cdr.markForCheck();

    } catch (error) {

      this.mensaje = error instanceof Error
        ? error.message
        : 'No se pudo registrar la inscripción.';

      this.tipoMensaje = 'error';

      this.cdr.markForCheck();

    }

  }

}
