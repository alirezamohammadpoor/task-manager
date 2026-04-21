import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule],
  template: `
    <button
      mat-raised-button
      [color]="color"
      [disabled]="disabled"
      (click)="onClick()"
    >
      <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
      {{ label }}
    </button>
  `,
  styles: [
    `
      button {
        margin: 5px;
      }
      mat-icon {
        margin-right: 4px;
      }
    `,
  ],
})
export class CustomButtonComponent {
  @Input() label: string = 'Button';
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() disabled: boolean = false;
  @Input() icon?: string;
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }
}
