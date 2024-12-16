import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Manga } from '../../../models/manga.interface';
import { MangaService } from '../../../core/services/manga.service';
import { BehaviorSubject, switchMap } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-manga-card',
  template: `
    <ion-card>
      <img [src]="manga.coverImage" [alt]="manga.title"/>
      <ion-card-header>
        <ion-card-title>{{ manga.title }}</ion-card-title>
        <ion-card-subtitle>{{ manga.authors.join(', ') }}</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <p>{{ manga.description | slice:0:100 }}...</p>
        <ion-badge color="primary" *ngFor="let tag of manga.tags">
          {{ tag }}
        </ion-badge>
      </ion-card-content>
      <ion-footer>
        <ion-row>
          <ion-col>
            <ion-button fill="clear" (click)="viewDetails.emit(manga)">
              <ion-icon slot="start" name="information-circle"></ion-icon>
              Details
            </ion-button>
          </ion-col>
          <ion-col *ngIf="auth.user$ | async">
            <ion-button fill="clear" (click)="onAddToLibrary()" *ngIf="!(isInLibrary$ | async)">
              <ion-icon slot="start" name="add-circle"></ion-icon>
              Add to Library
            </ion-button>
            <ion-button fill="clear" (click)="onRemoveFromLibrary()" *ngIf="isInLibrary$ | async">
              <ion-icon slot="start" name="remove-circle"></ion-icon>
              Remove from Library
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-footer>
    </ion-card>
  `,
  styles: [`
    ion-badge {
      margin-right: 4px;
      margin-bottom: 4px;
    }
    img {
      height: 300px;
      width: 200px;
      object-fit: cover;
      display: block;
      margin: 0 auto;
    }
  `],
  host: { '[attr.manga-id]': 'manga.id' }
})
export class MangaCardComponent{
  @Input() manga!: Manga;
  @Output() viewDetails = new EventEmitter<Manga>();
  @Output() addToLibrary = new EventEmitter<Manga>();
  @Output() removeFromLibrary = new EventEmitter<Manga>();
  
  private refreshTrigger = new BehaviorSubject<void>(undefined);
  isInLibrary$ = this.refreshTrigger.pipe(
    switchMap(() => this.mangaService.isInLibrary(this.manga.id))
  );

  constructor(
    private mangaService: MangaService,
    public auth: AuthService
  ) {}

  async onAddToLibrary() {
    await this.mangaService.addToLibrary(this.manga);
    this.refreshTrigger.next();
    this.addToLibrary.emit(this.manga);
  }

  async onRemoveFromLibrary() {
    await this.mangaService.removeFromLibrary(this.manga.id);
    this.refreshTrigger.next();
    this.removeFromLibrary.emit(this.manga);
  }

  refreshLibraryState() {
    this.refreshTrigger.next();
  }
}
