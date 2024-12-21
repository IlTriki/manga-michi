import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { MangaLibraryPage } from './pages/library/manga-library.page';
import { MangaDetailComponent } from './components/manga-detail.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { MangaSearchPage } from './pages/search/manga-search.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full'
  },
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
    MangaDetailComponent
  ]
})
export class MangaModule {}
