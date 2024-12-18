import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs-layout',
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button routerLink="/home" routerLinkActive="tab-selected">
          <ion-icon name="home"></ion-icon>
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button routerLink="/manga/search" routerLinkActive="tab-selected">
          <ion-icon name="search"></ion-icon>
          <ion-label>Search</ion-label>
        </ion-tab-button>

        <ion-tab-button routerLink="/manga/library" routerLinkActive="tab-selected">
          <ion-icon name="library"></ion-icon>
          <ion-label>Library</ion-label>
        </ion-tab-button>

        <ion-tab-button routerLink="/stores" routerLinkActive="tab-selected">
          <ion-icon name="location"></ion-icon>
          <ion-label>Stores</ion-label>
        </ion-tab-button>

        <ion-tab-button routerLink="/profile" routerLinkActive="tab-selected">
          <ion-icon name="person"></ion-icon>
          <ion-label>Profile</ion-label>
        </ion-tab-button>

        <ion-tab-button routerLink="/about" routerLinkActive="tab-selected">
          <ion-icon name="information-circle"></ion-icon>
          <ion-label>About</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `
})
export class TabsLayoutComponent {} 