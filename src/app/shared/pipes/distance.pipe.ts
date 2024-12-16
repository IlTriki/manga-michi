import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distance'
})
export class DistancePipe implements PipeTransform {
  transform(value: number): string {
    if (!value) return '';
    
    if (value < 1000) {
      return `${Math.round(value)}m`;
    } else {
      return `${(value / 1000).toFixed(1)}km`;
    }
  }
}
