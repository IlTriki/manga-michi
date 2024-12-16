import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="spinner-container">
      <ion-spinner name="circular"></ion-spinner>
      <p>Loading...</p>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
    }
  `]
})
export class LoadingSpinnerComponent {}
