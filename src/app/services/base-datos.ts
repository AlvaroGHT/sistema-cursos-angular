
import { Injectable } from '@angular/core';
import { Curso } from '../models/curso.model';
import { Inscripcion } from '../models/inscripcion.model';
import { Estudiante } from '../models/estudiante.model';

@Injectable({
  providedIn: 'root'
})
export class BaseDatos {

  private conexion!: IDBDatabase;

  private readonly nombreBaseDatos = 'SistemaCursosDB';

 async inicializar(): Promise<void> {

    this.conexion = await new Promise<IDBDatabase>((resolve, reject) => {

      const solicitud = indexedDB.open(this.nombreBaseDatos, 1);

      solicitud.onupgradeneeded = () => {

        const baseDatos = solicitud.result;

        if (!baseDatos.objectStoreNames.contains('cursos')) {
          baseDatos.createObjectStore('cursos', {
            keyPath: 'id'
          });
        }

        if (!baseDatos.objectStoreNames.contains('inscripciones')) {
          baseDatos.createObjectStore('inscripciones', {
            keyPath: 'id'
          });
        }

        if (!baseDatos.objectStoreNames.contains('configuracion')) {
          baseDatos.createObjectStore('configuracion', {
            keyPath: 'clave'
          });
        }

      };

      solicitud.onsuccess = () => resolve(solicitud.result);

      solicitud.onerror = () => reject(solicitud.error);

    });

    const cursos: Curso[] = [
      {
        id: 1,
        nombre: 'Programación con Java',
        descripcion: 'Aprende los fundamentos de programación utilizando Java.',
        categoria: 'Programación',
        capacidad: 20
      },
      {
        id: 2,
        nombre: 'Desarrollo Web',
        descripcion: 'Aprende a crear páginas web con HTML, CSS y JavaScript.',
        categoria: 'Desarrollo Web',
        capacidad: 20
      },
      {
        id: 3,
        nombre: 'Bases de Datos',
        descripcion: 'Aprende a diseñar y administrar bases de datos.',
        categoria: 'Bases de Datos',
        capacidad: 20
      },
      {
        id: 4,
        nombre: 'Angular desde Cero',
        descripcion: 'Aprende a desarrollar aplicaciones web con Angular.',
        categoria: 'Desarrollo Web',
        capacidad: 20
      },
      {
        id: 5,
        nombre: 'Programación PHP',
        descripcion: 'Aprende los fundamentos del desarrollo backend con PHP.',
        categoria: 'Programación',
        capacidad: 20
      }
    ];

    await new Promise<void>((resolve, reject) => {

      const transaccion = this.conexion.transaction(
        ['cursos', 'configuracion'],
        'readwrite'
      );

      const almacenCursos = transaccion.objectStore('cursos');
      const almacenConfiguracion = transaccion.objectStore('configuracion');

      const solicitudCursos = almacenCursos.getAll();

      solicitudCursos.onsuccess = () => {

        const cursosGuardados: Curso[] = solicitudCursos.result;

        if (cursosGuardados.length === 0) {

          for (const curso of cursos) {
            almacenCursos.add(curso);
          }

        }

        almacenConfiguracion.put({
          clave: 'cursosInicialesCargados',
          valor: true
        });

      };

      solicitudCursos.onerror = () => {
        transaccion.abort();
      };

      transaccion.oncomplete = () => resolve();

      transaccion.onerror = () => reject(transaccion.error);

      transaccion.onabort = () => {
        reject(transaccion.error || new Error('No se pudo inicializar la base de datos.'));
      };

    });

  }


  obtenerCursos(): Promise<Curso[]> {

    return new Promise<Curso[]>((resolve, reject) => {

      const transaccion = this.conexion.transaction(
        'cursos',
        'readonly'
      );

      const almacen = transaccion.objectStore('cursos');

      const solicitud = almacen.getAll();

      solicitud.onsuccess = () => {
        console.log('Cursos recuperados desde IndexedDB:', solicitud.result);
        resolve(solicitud.result);
      };

      solicitud.onerror = () => {
        reject(solicitud.error);
      };

    });

  }

  obtenerInscripciones(): Promise<Inscripcion[]> {

    return new Promise<Inscripcion[]>((resolve, reject) => {

      const transaccion = this.conexion.transaction(
        'inscripciones',
        'readonly'
      );

      const almacen = transaccion.objectStore('inscripciones');

      const solicitud = almacen.getAll();

      solicitud.onsuccess = () => {
        resolve(solicitud.result);
      };

      solicitud.onerror = () => {
        reject(solicitud.error);
      };

    });

  }

  obtenerInscripcionPorId(id: number): Promise<Inscripcion | undefined> {

    return new Promise<Inscripcion | undefined>((resolve, reject) => {

      const transaccion = this.conexion.transaction(
        'inscripciones',
        'readonly'
      );

      const almacen = transaccion.objectStore('inscripciones');

      const solicitud = almacen.get(id);

      solicitud.onsuccess = () => {
        resolve(solicitud.result);
      };

      solicitud.onerror = () => {
        reject(solicitud.error);
      };

    });

  }

  retirarInscripcion(id: number): Promise<void> {

    return new Promise<void>((resolve, reject) => {

      if (!Number.isInteger(id) || id <= 0) {
        reject(new Error('El identificador de inscripción no es válido.'));
        return;
      }

      const transaccion = this.conexion.transaction(
        'inscripciones',
        'readwrite'
      );

      const almacen = transaccion.objectStore('inscripciones');

      const solicitud = almacen.get(id);

      let errorControlado = false;

      solicitud.onsuccess = () => {

        const inscripcion: Inscripcion | undefined = solicitud.result;

        if (!inscripcion) {
          errorControlado = true;
          reject(new Error('No se encontró la inscripción.'));
          transaccion.abort();
          return;
        }

        if (inscripcion.estado === 'retirada') {
          errorControlado = true;
          reject(new Error('Esta inscripción ya fue retirada.'));
          transaccion.abort();
          return;
        }

        inscripcion.estado = 'retirada';

        almacen.put(inscripcion);

      };

      solicitud.onerror = () => {
        errorControlado = true;
        reject(solicitud.error);
      };

      transaccion.oncomplete = () => {
        if (!errorControlado) {
          resolve();
        }
      };

      transaccion.onerror = () => {
        if (!errorControlado) {
          errorControlado = true;
          reject(transaccion.error);
        }
      };

      transaccion.onabort = () => {
        if (!errorControlado) {
          errorControlado = true;
          reject(transaccion.error || new Error('No se pudo retirar la inscripción.'));
        }
      };

    });

  }

  registrarInscripcion(estudiante: Estudiante, cursoId: number): Promise<void> {

    return new Promise<void>((resolve, reject) => {

      if (
        !estudiante ||
        !Number.isInteger(estudiante.id) ||
        estudiante.id <= 0 ||
        !estudiante.nombre?.trim() ||
        !estudiante.apellido?.trim() ||
        !estudiante.correo ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(estudiante.correo.trim())
      ) {
        reject(new Error('Los datos del estudiante no son válidos.'));
        return;
      }

      if (!Number.isInteger(cursoId) || cursoId <= 0) {
        reject(new Error('El curso seleccionado no es válido.'));
        return;
      }

      const transaccion = this.conexion.transaction(
        ['cursos', 'inscripciones'],
        'readwrite'
      );

      const almacenCursos = transaccion.objectStore('cursos');
      const almacenInscripciones = transaccion.objectStore('inscripciones');

      const solicitudCurso = almacenCursos.get(cursoId);
      const solicitudInscripciones = almacenInscripciones.getAll();

      let cursoEncontrado = false;
      let inscripcionesEncontradas = false;
      let terminado = false;

      let curso: Curso | undefined;
      let inscripciones: Inscripcion[] = [];

      const rechazarRegistro = (mensaje: string) => {

        if (terminado) {
          return;
        }

        terminado = true;

        reject(new Error(mensaje));

        transaccion.abort();

      };

      const verificarRegistro = () => {

        if (!cursoEncontrado || !inscripcionesEncontradas || terminado) {
          return;
        }

        if (!curso) {
          rechazarRegistro('El curso seleccionado no existe.');
          return;
        }

        // Normalizar el correo para evitar duplicados
        const correoEstudiante = estudiante.correo.trim().toLowerCase();

        // Comprobar si ya existe una inscripción activa
        const duplicado = inscripciones.some(inscripcion =>
          inscripcion.cursoId === cursoId &&
          inscripcion.estudiante.correo?.trim().toLowerCase() === correoEstudiante &&
          inscripcion.estado === 'activa'
        );

        if (duplicado) {
          rechazarRegistro('El estudiante ya está registrado en este curso.');
          return;
        }

        // Comprobar los cupos disponibles
        const inscripcionesActivas = inscripciones.filter(inscripcion =>
          inscripcion.cursoId === cursoId &&
          inscripcion.estado === 'activa'
        );

        if (inscripcionesActivas.length >= curso.capacidad) {
          rechazarRegistro('El curso ya no tiene cupos disponibles.');
          return;
        }

        // Generar nuevo identificador
        const nuevoId = inscripciones.reduce(
          (mayorId, inscripcion) => Math.max(mayorId, inscripcion.id),
          0
        ) + 1;

        const nuevaInscripcion: Inscripcion = {
          id: nuevoId,
          estudiante: estudiante,
          cursoId: cursoId,
          fecha: new Date().toISOString(),
          estado: 'activa'
        };

        almacenInscripciones.add(nuevaInscripcion);

      };

      solicitudCurso.onsuccess = () => {

        curso = solicitudCurso.result;

        cursoEncontrado = true;

        verificarRegistro();

      };

      solicitudInscripciones.onsuccess = () => {

        inscripciones = solicitudInscripciones.result;

        inscripcionesEncontradas = true;

        verificarRegistro();

      };

      transaccion.oncomplete = () => {

        if (!terminado) {
          resolve();
        }

      };

      transaccion.onerror = () => {

        if (!terminado) {
          terminado = true;
          reject(transaccion.error);
        }

      };

      transaccion.onabort = () => {

        if (!terminado) {
          terminado = true;
          reject(transaccion.error);
        }

      };

    });

  }
}