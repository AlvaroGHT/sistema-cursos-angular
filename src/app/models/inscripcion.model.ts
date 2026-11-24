
import { Estudiante } from './estudiante.model';
export interface Inscripcion {
  id: number;
  estudiante: Estudiante;
  cursoId: number;
  fecha: string;
  estado: 'activa' | 'retirada';
}
