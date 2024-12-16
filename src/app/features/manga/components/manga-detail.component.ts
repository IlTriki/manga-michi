import { Component, Input } from '@angular/core';
import { Manga } from '../../../models/manga.interface';
import { MangaService } from '../../../core/services/manga.service';
import { AuthService } from '../../../core/services/auth.service';
import { ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject, switchMap } from 'rxjs';

@Component({
  selector: 'app-manga-detail',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="dismiss()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ manga.title }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card>
        <img [src]="manga.coverImage" [alt]="manga.title"/>
        <ion-card-header>
          <ion-card-title>{{ manga.title }}</ion-card-title>
          <ion-card-subtitle>
            By {{ manga.authors.join(', ') }}
          </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <p>{{ manga.description }}</p>
          
          <ion-list>
            <ion-item>
              <ion-label>
                <h2>Status</h2>
                <p>{{ manga.status }}</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label>
                <h2>Tags</h2>
                <ion-badge color="primary" *ngFor="let tag of manga.tags">
                  {{ tag }}
                </ion-badge>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <div class="ion-padding">
        <ion-button expand="block" (click)="onReadNow()" 
          *ngIf="(auth.user$ | async) && (isInLibrary$ | async)">
          <ion-icon slot="start" name="book"></ion-icon>
          Read Now
        </ion-button>

        <ion-button expand="block" (click)="onAddToLibrary()" 
          *ngIf="(auth.user$ | async) && !(isInLibrary$ | async)">
          <ion-icon slot="start" name="add-circle"></ion-icon>
          Add to Library
        </ion-button>
        
        <ion-button expand="block" (click)="onRemoveFromLibrary()" 
          *ngIf="(auth.user$ | async) && (isInLibrary$ | async)">
          <ion-icon slot="start" name="remove-circle"></ion-icon>
          Remove from Library
        </ion-button>
      </div>
    </ion-content>
  `,
  styles: [`
    ion-badge {
      margin-right: 4px;
    }
    img {
      height: 400px;
      width: 266px;
      object-fit: cover;
      display: block;
      margin: 0 auto;
    }
  `]
})
export class MangaDetailComponent {
  @Input() manga!: Manga;
  
  private refreshTrigger = new BehaviorSubject<void>(undefined);
  isInLibrary$ = this.refreshTrigger.pipe(
    switchMap(() => this.mangaService.isInLibrary(this.manga.id))
  );

  constructor(
    private mangaService: MangaService,
    public auth: AuthService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {}

  onReadNow() {
    const mangaDexUrl = `https://mangadex.org/title/${this.manga.id}`;
    window.open(mangaDexUrl, '_blank');
  }

  async onAddToLibrary() {
    try {
      await this.mangaService.addToLibrary(this.manga);
      this.refreshTrigger.next();
      const toast = await this.toastCtrl.create({
        message: 'Added to your library!',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
      await this.modalCtrl.dismiss({ action: 'added' });
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Error adding to library',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }

  async onRemoveFromLibrary() {
    try {
      await this.mangaService.removeFromLibrary(this.manga.id);
      this.refreshTrigger.next();
      await this.modalCtrl.dismiss({ action: 'removed' });
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Error removing from library',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }

  dismiss() {
    return this.modalCtrl.dismiss();
  }
}
