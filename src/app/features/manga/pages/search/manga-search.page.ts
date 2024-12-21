import { Component, ViewChildren, QueryList } from '@angular/core';
import { MangaService } from '../../../../core/services/manga.service';
import { Manga } from '../../../../models/manga.interface';
import { ModalController } from '@ionic/angular';
import { MangaDetailComponent } from '../../components/manga-detail.component';
import { MangaCardComponent } from '../../components/manga-card.component';

@Component({
  selector: 'app-manga-search',
  templateUrl: './manga-search.page.html',
  styleUrls: ['./manga-search.page.scss'],
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
