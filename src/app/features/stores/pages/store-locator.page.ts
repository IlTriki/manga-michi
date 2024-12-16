import { Component, OnInit } from '@angular/core';
import { StoreLocatorService } from '../../../core/services/store-locator.service';
import { Store } from '../../../models/store.interface';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-store-locator',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Nearby Manga Stores</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="refreshStores()">
            <ion-icon slot="icon-only" name="refresh"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div *ngIf="isLoading" class="ion-padding ion-text-center">
        <app-loading-spinner></app-loading-spinner>
      </div>

      <ion-grid *ngIf="!isLoading">
        <ion-row>
          <ion-col size="12" size-md="6" *ngFor="let store of stores">
            <app-store-card
              [store]="store"
              (navigate)="navigateToStore($event)">
            </app-store-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <div *ngIf="!isLoading && stores.length === 0" class="ion-padding ion-text-center">
        <p>No manga stores found nearby.</p>
        <ion-button (click)="refreshStores()">
          <ion-icon slot="start" name="refresh"></ion-icon>
          Try Again
        </ion-button>
      </div>
    </ion-content>
  `
})
export class StoreLocatorPage implements OnInit {
  stores: Store[] = [];
  isLoading = false;

  constructor(
    private storeService: StoreLocatorService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loadStores();
  }

  async loadStores() {
    this.isLoading = true;
    try {
      this.stores = await this.storeService.getNearbyStores();
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async refreshStores() {
    const loading = await this.loadingCtrl.create({
      message: 'Refreshing stores...'
    });
    await loading.present();

    try {
      await this.loadStores();
    } finally {
      await loading.dismiss();
    }
  }

  navigateToStore(store: Store) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.location.lat},${store.location.lng}`;
    window.open(url, '_blank');
  }
}
