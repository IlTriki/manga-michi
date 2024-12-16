import { Component, OnInit } from '@angular/core';
import { MangaService } from '../../../core/services/manga.service';
import { Manga } from '../../../models/manga.interface';
import { ModalController } from '@ionic/angular';
import { MangaDetailComponent } from '../components/manga-detail.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-manga-library',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>My Library</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ng-container *ngIf="library$ | async as mangas">
        <ion-grid *ngIf="mangas.length > 0">
          <ion-row>
            <ion-col size="12" size-md="6" *ngFor="let manga of mangas">
              <app-manga-card
                [manga]="manga"
                (viewDetails)="openDetails($event)"
                (removeFromLibrary)="removeFromLibrary($event)">
              </app-manga-card>
            </ion-col>
          </ion-row>
        </ion-grid>

        <div *ngIf="mangas.length === 0" class="ion-padding ion-text-center">
          <p>Your library is empty. Start by searching and adding some manga!</p>
          <ion-button routerLink="/manga/search">
            <ion-icon slot="start" name="search"></ion-icon>
            Search Manga
          </ion-button>
        </div>
      </ng-container>
    </ion-content>
  `
})
export class MangaLibraryPage implements OnInit {
  library$!: Observable<Manga[]>;

  constructor(
    private mangaService: MangaService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.library$ = this.mangaService.getUserLibrary();
  }

  async openDetails(manga: Manga) {
    const modal = await this.modalCtrl.create({
      component: MangaDetailComponent,
      componentProps: { manga }
    });
    await modal.present();
  }

  async removeFromLibrary(manga: Manga) {
    try {
      await this.mangaService.removeFromLibrary(manga.id);
    } catch (error) {
      console.error('Error removing from library:', error);
    }
  }
}
