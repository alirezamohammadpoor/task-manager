import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { Project, ProjectStatus } from '../../../models/project.interface';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Project' : 'New Project' }}</h2>
    <form [formGroup]="projectForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Project Name</mat-label>
          <input
            matInput
            formControlName="name"
            placeholder="Enter project name"
          />
          <mat-error *ngIf="projectForm.get('name')?.hasError('required')">
            Project name is required
          </mat-error>
          <mat-error *ngIf="projectForm.get('name')?.hasError('minlength')">
            Project name must be at least 3 characters
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea
            matInput
            formControlName="description"
            rows="4"
            placeholder="Enter project description"
          ></textarea>
          <mat-error
            *ngIf="projectForm.get('description')?.hasError('required')"
          >
            Description is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="active">Active</mat-option>
            <mat-option value="completed">Completed</mat-option>
            <mat-option value="archived">Archived</mat-option>
          </mat-select>
          <mat-error *ngIf="projectForm.get('status')?.hasError('required')">
            Status is required
          </mat-error>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="projectForm.invalid"
        >
          {{ data ? 'Update' : 'Create' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }

      mat-dialog-content {
        min-width: 400px;
      }
    `,
  ],
})
export class ProjectFormComponent {
  // Form group for project data
  projectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProjectFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project | null
  ) {
    // Initialize the form with data if available
    this.projectForm = this.fb.group({
      name: [data?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [data?.description || '', Validators.required],
      status: [data?.status || 'active', Validators.required],
    });
  }

  // Handle form submission
  onSubmit() {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;
      const projectData = {
        ...formValue,
        createdAt: this.data?.createdAt || new Date(),
        updatedAt: new Date(),
        tasks: this.data?.tasks || [],
      };
      this.dialogRef.close(projectData);
    }
  }

  // Handle cancel button click
  onCancel() {
    this.dialogRef.close();
  }
}
