import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { StoreLocatorPage } from './pages/store-locator.page';
import { StoreCardComponent } from './components/store-card.component';

const routes: Routes = [
  {
    path: '',
    component: StoreLocatorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    StoreLocatorPage,
    StoreCardComponent
  ]
})
export class StoresModule {}
