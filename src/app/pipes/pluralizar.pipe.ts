import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pluralizar',
  standalone: true
})
export class PluralizarPipe implements PipeTransform {

  transform(
    valor: number,
    singular: string = 'estudiante',
    plural: string = 'estudiantes'
  ): string {

    return `${valor} ${valor === 1 ? singular : plural}`;
  }

}