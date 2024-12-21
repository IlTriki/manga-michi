import { Component, OnInit } from '@angular/core';
import { MangaService } from '../../../../core/services/manga.service';
import { Manga } from '../../../../models/manga.interface';
import { ModalController } from '@ionic/angular';
import { MangaDetailComponent } from '../../components/manga-detail.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-manga-library',
  templateUrl: './manga-library.page.html',
  styleUrls: ['./manga-library.page.scss'],
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
