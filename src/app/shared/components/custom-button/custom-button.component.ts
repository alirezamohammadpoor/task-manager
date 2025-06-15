import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <button
      mat-raised-button
      [color]="color"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
    >
      <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
      {{ label }}
    </button>
  `,
  styles: [
    `
      button {
        margin: 4px;
      }
      mat-icon {
        margin-right: 8px;
      }
    `,
  ],
})
export class CustomButtonComponent {
  @Input() label: string = '';
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() icon: string = '';
  @Input() disabled: boolean = false;
  @Output() onClick = new EventEmitter<MouseEvent>();
}
