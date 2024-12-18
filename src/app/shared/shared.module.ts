import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
    DistancePipe,
  ],
  exports: [
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    DistancePipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {} 