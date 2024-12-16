import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
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
                <ion-item routerLink="/manga/search" routerDirection="root" lines="none" detail="false" routerLinkActive="selected">
                  <ion-icon slot="start" name="search"></ion-icon>
                  <ion-label>Search Manga</ion-label>
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
                <ion-item routerLink="/about" routerDirection="root" lines="none" detail="false" routerLinkActive="selected">
                  <ion-icon slot="start" name="information-circle"></ion-icon>
                  <ion-label>About</ion-label>
                </ion-item>
              </ion-menu-toggle>
            </ion-list>
          </ion-content>
        </ion-menu>
        <ion-router-outlet id="main-content"></ion-router-outlet>
      </ion-split-pane>
    </ion-app>
  `
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadGoogleMapsScript();
  }

  private loadGoogleMapsScript() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places,geometry&loading=async`;
    script.type = 'text/javascript';
    document.head.appendChild(script);
  }
}
