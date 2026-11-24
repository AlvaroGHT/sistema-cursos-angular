# Estudiante

Alvaro Guillermo Huanca Taco

# Sistema de Gestión de Cursos

Aplicación web desarrollada con **Angular 22**, **TypeScript**, **Bootstrap 5.3.9** e **IndexedDB**, que permite gestionar la consulta de cursos y las inscripciones de estudiantes.

## Descripción del proyecto

El sistema permite consultar los cursos disponibles, registrar estudiantes, revisar el historial de inscripciones y consultar los detalles de cada registro. También permite retirar inscripciones y actualizar su estado.

La información se almacena en el navegador mediante IndexedDB, por lo que permanece guardada aunque se cierre o actualice la página.

## Tecnologías utilizadas

- Angular 22.2.7
- TypeScript
- HTML5 y CSS3
- Bootstrap 5.3.9
- IndexedDB
- Git y GitHub

## Funcionalidades principales

### 1. Consulta de cursos
- Visualización de los cursos disponibles.
- Búsqueda por nombre o descripción.
- Filtro por categoría.

### 2. Registro de estudiantes
- Formulario para registrar estudiantes en los cursos.
- Validación de campos obligatorios.
- Validación del correo electrónico.
- Prevención de inscripciones duplicadas activas en el mismo curso.
- Control de capacidad de los cursos.

### 3. Historial de inscripciones
- Visualización de las inscripciones registradas.
- Consulta de fechas y estados.
- Filtro por estado de inscripción.
- Acceso al detalle de cada inscripción.

### 4. Detalle de inscripción
- Consulta de los datos del estudiante y del curso.
- Visualización de la información de la inscripción.
- Opción para retirar una inscripción.
- Actualización del estado después de retirar una inscripción.
- Mensaje cuando no existe una inscripción solicitada.

## Almacenamiento de datos

El sistema utiliza **IndexedDB** para guardar los cursos y las inscripciones directamente en el navegador.

Los datos permanecen disponibles después de actualizar o cerrar el navegador. Sin embargo, no se sincronizan automáticamente entre diferentes dispositivos o navegadores.

## Instalación y ejecución

### Requisitos
- Node.js
- npm
- Angular CLI

### 1. Clonar el repositorio

```bash
git clone https://github.com/AlvaroGHT/sistema-cursos-angular.git
```

### 2. Ingresar a la carpeta

```bash
cd sistema-cursos-angular
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Ejecutar el servidor

```bash
ng serve
```

### 5. Abrir en el navegador

```text
http://localhost:4200/
```

## Compilación del proyecto

Para generar la versión de producción:

```bash
ng build
```

Los archivos compilados se almacenarán en la carpeta `dist/`.

## Autor

**Alvaro Guillermo Huanca Taco**

GitHub: https://github.com/AlvaroGHT

## Repositorio

https://github.com/AlvaroGHT/sistema-cursos-angular