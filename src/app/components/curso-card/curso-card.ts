import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Curso } from '../../models/curso.model';
import { PluralizarPipe } from '../../pipes/pluralizar.pipe';
import { ResaltarDirective } from '../../directives/resaltar.directive';

@Component({
  selector: 'app-curso-card',
  standalone: true,
  imports: [PluralizarPipe, ResaltarDirective],
  templateUrl: './curso-card.html',
  styleUrl: './curso-card.css',
})
export class CursoCard {

  @Input({ required: true }) curso!: Curso;

  @Output() seleccionar = new EventEmitter<Curso>();

}