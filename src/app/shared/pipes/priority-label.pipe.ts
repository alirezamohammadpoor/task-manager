import { Pipe, PipeTransform } from '@angular/core';
import { TaskPriority } from '../../models/task.interface';

@Pipe({
  name: 'priorityLabel',
  standalone: true,
})
export class PriorityLabelPipe implements PipeTransform {
  // Transform priority enum to a readable label
  transform(priority: TaskPriority): string {
    switch (priority) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return 'Unknown';
    }
  }
}
