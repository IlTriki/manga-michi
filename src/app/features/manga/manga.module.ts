import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { MangaSearchPage } from './pages/manga-search.page';
import { MangaLibraryPage } from './pages/manga-library.page';
import { MangaCardComponent } from './components/manga-card.component';
import { MangaDetailComponent } from './components/manga-detail.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'search',
    component: MangaSearchPage
  },
  {
    path: 'library',
    component: MangaLibraryPage,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    MangaSearchPage,
    MangaLibraryPage,
    MangaCardComponent,
    MangaDetailComponent
  ]
})
export class MangaModule {}
