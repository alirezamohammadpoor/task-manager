import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <button
      mat-raised-button
      [color]="color"
      [disabled]="disabled"
      (click)="onClick()"
    >
      {{ label }}
    </button>
  `,
  styles: [
    `
      button {
        margin: 5px;
      }
    `,
  ],
})
export class CustomButtonComponent {
  // Input for button label
  @Input() label: string = 'Button';
  // Input for button color
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  // Input to disable the button
  @Input() disabled: boolean = false;
  // Output event for button click
  @Output() clicked = new EventEmitter<void>();

  // Handle button click
  onClick() {
    this.clicked.emit();
  }
}
