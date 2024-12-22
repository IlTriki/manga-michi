import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthService } from './core/services/auth.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ng-container *ngIf="platform.width() > 768; else mobileLayout">
        <app-menu-layout></app-menu-layout>
      </ng-container>
      
      <ng-template #mobileLayout>
        <app-tabs-layout></app-tabs-layout>
      </ng-template>
    </ion-app>
  `
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    public platform: Platform
  ) {}

  ngOnInit() {
    this.loadGoogleMapsScript();
  }

  /**
   * Loads the Google Maps JavaScript API script
   * This is necessary for the stores page to function
   */
  private loadGoogleMapsScript() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places,geometry&loading=async`;
    script.type = 'text/javascript';
    document.head.appendChild(script);
  }
}
