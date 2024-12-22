import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '../../../models/store.interface';

@Component({
  selector: 'app-store-card',
  template: `
    <ion-card>
      <!-- Store header with name and address -->
      <ion-card-header>
        <ion-card-title>{{ store.name }}</ion-card-title>
        <ion-card-subtitle>{{ store.address }}</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <!-- Display opening hours if available -->
        <div *ngIf="store.openingHours?.length">
          <p><strong>Opening Hours:</strong></p>
          <p *ngFor="let hours of store.openingHours">{{ hours }}</p>
        </div>
        <ion-row class="ion-align-items-end">
          <!-- Store rating display -->
          <ion-col size="6">
            <div *ngIf="store.rating" class="rating">
              <ion-icon name="star" color="warning"></ion-icon>
              <span>{{ store.rating }} / 5</span>
            </div>
          </ion-col>
          <!-- Distance from user's location -->
          <ion-col size="6" class="ion-text-end">
            <p class="distance-text">{{ store.distance }} km away</p>
          </ion-col>
        </ion-row>
      </ion-card-content>
      <ion-footer>
        <ion-row>
          <ion-col size="6">
            <ion-button fill="clear" (click)="navigate.emit(store)">
              <ion-icon slot="start" name="navigate"></ion-icon>
              Navigate
            </ion-button>
          </ion-col>
          <ion-col size="6">
            <div class="status-badge" [class.open]="store.isOpen">
              {{ store.isOpen ? 'Open' : 'Closed' }}
            </div>
          </ion-col>
        </ion-row>
      </ion-footer>
    </ion-card>
  `,
  styles: [`
    .rating {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 8px;
    }
    ion-icon {
      font-size: 18px;
    }
    .distance-text {
      margin-left: 4px;
      color: var(--ion-color-medium);
      font-size: 0.9em;
    }
    .status-badge {
      display: inline-block;
      margin-left: auto;
      margin-right: 8px;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8em;
      font-weight: bold;
      margin-bottom: 0;
      background-color: var(--ion-color-danger);
      color: white;
    }
    .status-badge.open {
      background-color: var(--ion-color-success);
    }
    ion-footer ion-row {
      align-items: center;
      padding: 8px;
    }
    ion-footer ion-col {
      display: flex;
      align-items: center;
    }
  `]
})
export class StoreCardComponent {
  @Input() store!: Store;
  @Output() navigate = new EventEmitter<Store>();
}
