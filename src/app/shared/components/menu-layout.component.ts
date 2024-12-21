import { Component } from '@angular/core';

@Component({
  selector: 'app-menu-layout',
  template: `
    <ion-split-pane contentId="main-content">
        <ion-menu contentId="main-content" type="overlay">
        <ion-content>
            <ion-list id="inbox-list">
                <ion-list-header>MangaMichi</ion-list-header>
                <ion-menu-toggle auto-hide="false">
                    <ion-item routerLink="/home" routerDirection="root" lines="none" detail="false" routerLinkActive="selected">
                        <ion-icon slot="start" name="home"></ion-icon>
                        <ion-label>Home</ion-label>
                    </ion-item>
                    <ion-item routerLink="/manga/library" routerDirection="root" lines="none" detail="false" routerLinkActive="selected">
                        <ion-icon slot="start" name="library"></ion-icon>
                        <ion-label>My Library</ion-label>
                    </ion-item>
                    <ion-item routerLink="/stores" routerDirection="root" lines="none" detail="false" routerLinkActive="selected">
                        <ion-icon slot="start" name="location"></ion-icon>
                        <ion-label>Find Stores</ion-label>
                    </ion-item>
                    <ion-item routerLink="/profile" routerDirection="root" lines="none" detail="false" routerLinkActive="selected">
                        <ion-icon slot="start" name="person"></ion-icon>
                        <ion-label>Profile</ion-label>
                    </ion-item>
                </ion-menu-toggle>
            </ion-list>
        </ion-content>
        </ion-menu>
        <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
  `
})
export class MenuLayoutComponent {} 