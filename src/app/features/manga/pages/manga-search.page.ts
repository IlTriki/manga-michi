import { Component, ViewChildren, QueryList } from '@angular/core';
import { MangaService } from '../../../core/services/manga.service';
import { Manga } from '../../../models/manga.interface';
import { ModalController } from '@ionic/angular';
import { MangaDetailComponent } from '../components/manga-detail.component';
import { MangaCardComponent } from '../components/manga-card.component';

@Component({
  selector: 'app-manga-search',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Search Manga</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar
          [(ngModel)]="searchQuery"
          (ionInput)="handleSearch($event)"
          [debounce]="500"
          placeholder="Search for manga...">
        </ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div *ngIf="isLoading" class="ion-padding ion-text-center">
        <app-loading-spinner></app-loading-spinner>
      </div>

      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6" *ngFor="let manga of searchResults">
            <app-manga-card
              [manga]="manga"
              (viewDetails)="openDetails($event)"
              (addToLibrary)="addToLibrary($event)">
            </app-manga-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <div *ngIf="!isLoading && searchResults.length === 0" class="ion-padding ion-text-center">
        <p>No results found. Try a different search term.</p>
      </div>
    </ion-content>
  `
})
export class MangaSearchPage {
  searchQuery = '';
  searchResults: Manga[] = [];
  isLoading = false;
  @ViewChildren(MangaCardComponent) mangaCards!: QueryList<MangaCardComponent>;

  constructor(
    private mangaService: MangaService,
    private modalCtrl: ModalController
  ) {}

  async handleSearch(event: any) {
    const query = event.target.value.toLowerCase();
    if (query.length < 3) return;

    this.isLoading = true;
    try {
      this.searchResults = await this.mangaService.searchManga(query);
    } catch (error) {
      console.error('Search error:', error);
      this.searchResults = [];
    } finally {
      this.isLoading = false;
    }
  }

  async openDetails(manga: Manga) {
    const modal = await this.modalCtrl.create({
      component: MangaDetailComponent,
      componentProps: { manga }
    });
    
    await modal.present();
    
    const { data } = await modal.onDidDismiss();
    if (data?.action) {
      const card = this.mangaCards.find(card => card.manga.id === manga.id);
      if (card) {
        card.refreshLibraryState();
      }
    }
  }

  async addToLibrary(manga: Manga) {
    try {
      await this.mangaService.addToLibrary(manga);
    } catch (error) {
      console.error('Error adding to library:', error);
    }
  }
}
