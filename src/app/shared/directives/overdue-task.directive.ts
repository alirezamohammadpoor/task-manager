import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appOverdueTask]',
  standalone: true,
})
export class OverdueTaskDirective implements OnInit {
  // Input for the due date of the task
  @Input() dueDate!: Date;
  // Input to check if the task is completed
  @Input() isCompleted!: boolean;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // Check if the task is overdue and not completed
    if (this.isOverdue() && !this.isCompleted) {
      this.el.nativeElement.style.color = 'red';
    }
  }

  // Check if the task is overdue
  private isOverdue(): boolean {
    return new Date(this.dueDate) < new Date();
  }
}
