import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverdueTaskDirective } from './directives/overdue-task.directive';
import { PriorityLabelPipe } from './pipes/priority-label.pipe';
import { CustomButtonComponent } from './components/custom-button/custom-button.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OverdueTaskDirective,
    PriorityLabelPipe,
    CustomButtonComponent,
  ],
  exports: [OverdueTaskDirective, PriorityLabelPipe, CustomButtonComponent],
})
export class SharedModule {}
