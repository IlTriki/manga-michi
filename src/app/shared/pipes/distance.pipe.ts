import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to format distance values into a human-readable format
 * Converts meters to kilometers if the distance is greater than 1000 meters
 */
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
