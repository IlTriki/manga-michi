import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { LoadingSpinnerComponent } from './components/loading-spinner.component';
import { ErrorMessageComponent } from './components/error-message.component';
import { DistancePipe } from './pipes/distance.pipe';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    DistancePipe
  ],
  exports: [
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    DistancePipe
  ]
})
export class SharedModule {} 