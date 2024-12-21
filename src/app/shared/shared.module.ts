import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { LoadingSpinnerComponent } from './components/loading-spinner.component';
import { ErrorMessageComponent } from './components/error-message.component';
import { DistancePipe } from './pipes/distance.pipe';
import { MangaCardComponent } from '../features/manga/components/manga-card.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  declarations: [
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    DistancePipe,
    MangaCardComponent
  ],
  exports: [
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    DistancePipe,
    MangaCardComponent,
    RouterModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {} 