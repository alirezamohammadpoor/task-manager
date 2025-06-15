import { Pipe, PipeTransform } from '@angular/core';
import { TaskPriority } from '../../models/task.interface';

@Pipe({
  name: 'priorityLabel',
  standalone: true,
})
export class PriorityLabelPipe implements PipeTransform {
  transform(priority: TaskPriority): string {
    const labels = {
      low: 'Low Priority',
      medium: 'Medium Priority',
      high: 'High Priority',
    };
    return labels[priority] || priority;
  }
}
