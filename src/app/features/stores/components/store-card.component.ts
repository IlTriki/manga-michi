import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '../../../models/store.interface';

@Component({
  selector: 'app-store-card',
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>{{ store.name }}</ion-card-title>
        <ion-card-subtitle>{{ store.address }}</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <div *ngIf="store.openingHours?.length">
          <p><strong>Opening Hours:</strong></p>
          <p *ngFor="let hours of store.openingHours">{{ hours }}</p>
        </div>
        <div *ngIf="store.rating" class="rating">
          <ion-icon name="star" color="warning"></ion-icon>
          <span>{{ store.rating }} / 5</span>
        </div>
        <p class="distance-text">{{ store.distance }} km away</p>
      </ion-card-content>
      <ion-footer>
        <ion-row>
          <ion-col>
            <ion-button fill="clear" (click)="navigate.emit(store)">
              <ion-icon slot="start" name="navigate"></ion-icon>
              Navigate
            </ion-button>
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
  `]
})
export class StoreCardComponent {
  @Input() store!: Store;
  @Output() navigate = new EventEmitter<Store>();
}
