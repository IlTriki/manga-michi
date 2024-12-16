import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-message',
  template: `
    <div class="error-container">
      <ion-icon name="warning" color="danger"></ion-icon>
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <ion-button *ngIf="retryButton" (click)="retry.emit()" fill="clear">
        <ion-icon slot="start" name="refresh"></ion-icon>
        Try Again
      </ion-button>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      text-align: center;
    }
    ion-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    h2 {
      margin: 0;
      color: var(--ion-color-danger);
    }
    p {
      margin: 8px 0 16px;
      color: var(--ion-color-medium);
    }
  `]
})
export class ErrorMessageComponent {
  @Input() title = 'Error';
  @Input() message = 'Something went wrong. Please try again.';
  @Input() retryButton = true;
  @Output() retry = new EventEmitter<void>();
} 