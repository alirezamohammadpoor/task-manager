import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appOverdueTask]',
  standalone: true,
})
export class OverdueTaskDirective implements OnChanges {
  @Input() dueDate?: Date;
  @Input() isCompleted: boolean = false;

  constructor(private el: ElementRef) {}

  ngOnChanges() {
    if (this.isCompleted) {
      this.el.nativeElement.style.color = '#888';
      return;
    }

    if (this.dueDate) {
      const today = new Date();
      const dueDate = new Date(this.dueDate);

      if (dueDate < today) {
        this.el.nativeElement.style.color = '#f44336';
        this.el.nativeElement.style.fontWeight = 'bold';
      } else {
        this.el.nativeElement.style.color = '';
        this.el.nativeElement.style.fontWeight = '';
      }
    }
  }
}
