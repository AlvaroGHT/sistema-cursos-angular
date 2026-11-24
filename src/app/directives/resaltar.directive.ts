import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appResaltar]',
  standalone: true
})
export class ResaltarDirective {

  constructor(
    private elemento: ElementRef,
    private renderer: Renderer2
  ) {}

  @HostListener('mouseenter')
  alEntrar(): void {
    this.renderer.setStyle(
      this.elemento.nativeElement,
      'transform',
      'translateY(-5px)'
    );

    this.renderer.setStyle(
      this.elemento.nativeElement,
      'box-shadow',
      '0 6px 15px rgba(0, 0, 0, 0.15)'
    );
  }

  @HostListener('mouseleave')
  alSalir(): void {
    this.renderer.removeStyle(
      this.elemento.nativeElement,
      'transform'
    );

    this.renderer.removeStyle(
      this.elemento.nativeElement,
      'box-shadow'
    );
  }

}