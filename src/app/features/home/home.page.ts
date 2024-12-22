import { Component, ViewChildren, QueryList } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { MangaService } from '../../core/services/manga.service';
import { Router } from '@angular/router';
import { MangaDetailComponent } from '../manga/components/manga-detail.component';
import { Manga } from 'src/app/models/manga.interface';
import { ModalController } from '@ionic/angular';
import { MangaCardComponent } from '../manga/components/manga-card.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {
  showSearch = false;
  searchQuery = '';
  searchResults: any[] = [];
  isLoading = false;
  @ViewChildren(MangaCardComponent) mangaCards!: QueryList<MangaCardComponent>;

  constructor(
    public auth: AuthService,
    private mangaService: MangaService,
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  /**
   * Handles the search input event
   * Filters the search results based on the input query
   */
  async handleSearch(event: any) {
    const query = event.target.value.toLowerCase();
    if (query.length < 3) {
      this.searchResults = [];
      return;
    }

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
