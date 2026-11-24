
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Inscripcion } from '../../models/inscripcion.model';
import { Curso } from '../../models/curso.model';
import { BaseDatos } from '../../services/base-datos';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle.html',
  styleUrl: './detalle.css',
})
export class Detalle implements OnInit {

  inscripcion?: Inscripcion;
  curso?: Curso;

  mensaje: string = '';
  tipoMensaje: string = '';

  cargando: boolean = true;
  procesando: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private baseDatos: BaseDatos,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.mensaje = 'El identificador de inscripción no es válido.';
      this.tipoMensaje = 'error';
      this.cargando = false;
      this.cdr.markForCheck();
      return;
    }

    try {

      const inscripcion =
        await this.baseDatos.obtenerInscripcionPorId(id);

      if (!inscripcion) {
        this.mensaje = 'No se encontró la inscripción solicitada.';
        this.tipoMensaje = 'error';
        this.cargando = false;
        this.cdr.markForCheck();
        return;
      }

      this.inscripcion = inscripcion;

      const cursos = await this.baseDatos.obtenerCursos();

      this.curso = cursos.find(
        curso => curso.id === inscripcion.cursoId
      );

      this.cargando = false;
      this.cdr.markForCheck();

    } catch (error) {

      console.error('Error al cargar el detalle:', error);

      this.mensaje = 'No se pudo cargar el detalle de la inscripción.';
      this.tipoMensaje = 'error';

      this.cargando = false;
      this.cdr.markForCheck();

    }

  }

  formatearFecha(fecha: string): string {

    const fechaConvertida = new Date(fecha);

    if (isNaN(fechaConvertida.getTime())) {
      return 'Fecha no disponible';
    }

    return fechaConvertida.toLocaleString('es-BO');

  }

  async retirar(): Promise<void> {

    if (!this.inscripcion || this.procesando) {
      return;
    }

    if (this.inscripcion.estado === 'retirada') {
      this.mensaje = 'Esta inscripción ya fue retirada.';
      this.tipoMensaje = 'error';
      return;
    }

    const confirmar = window.confirm(
      '¿Estás seguro de que deseas retirar esta inscripción?'
    );

    if (!confirmar) {
      return;
    }

    this.procesando = true;
    this.mensaje = '';
    this.tipoMensaje = '';

    try {

      await this.baseDatos.retirarInscripcion(
        this.inscripcion.id
      );

      this.inscripcion.estado = 'retirada';

      this.mensaje = 'La inscripción fue retirada correctamente. El cupo del curso está disponible nuevamente.';
      this.tipoMensaje = 'exito';

    } catch (error) {

      this.mensaje = error instanceof Error
        ? error.message
        : 'No se pudo retirar la inscripción.';

      this.tipoMensaje = 'error';

      console.error('Error al retirar inscripción:', error);

    } finally {

      this.procesando = false;
      this.cdr.markForCheck();

    }

  }

}
