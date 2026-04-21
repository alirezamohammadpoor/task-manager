import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appOverdueTask]',
  standalone: true,
})
export class OverdueTaskDirective implements OnInit {
  @Input() dueDate!: Date;
  @Input() isCompleted!: boolean;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.isOverdue() && !this.isCompleted) {
      this.el.nativeElement.style.color = 'red';
    }
  }

  private isOverdue(): boolean {
    return new Date(this.dueDate) < new Date();
  }
}
