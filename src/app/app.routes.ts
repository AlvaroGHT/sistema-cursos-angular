
import { Routes } from '@angular/router';

import { Consulta } from './pages/consulta/consulta';
import { Registro } from './pages/registro/registro';
import { Historial } from './pages/historial/historial';
import { Detalle } from './pages/detalle/detalle';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'cursos',
    pathMatch: 'full'
  },
  {
    path: 'cursos',
    component: Consulta
  },
  {
    path: 'registro',
    component: Registro
  },
  {
    path: 'historial',
    component: Historial
  },
  {
    path: 'detalle/:id',
    component: Detalle
  },
  {
    path: '**',
    redirectTo: 'cursos'
  }
];
